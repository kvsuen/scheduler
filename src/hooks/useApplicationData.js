import { useEffect, useReducer } from 'react';
import Axios from 'axios';

const useApplicationData = () => {
  const SET_DAY = 'SET_DAY';
  const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
  const SET_INTERVIEW = 'SET_INTERVIEW';
  const SET_SPOTS = "SET_SPOTS";

  const reducer = (state, action) => {
    switch (action.type) {
      case SET_DAY:
        return {
          ...state,
          day: action.value
        };
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.value[0].data,
          appointments: action.value[1].data,
          interviewers: action.value[2].data
        };
      case SET_INTERVIEW:
        return {
          ...state,
          appointments: action.value
        };
      case SET_SPOTS:
        return {
          ...state,
          days: action.value
        }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  };

  const getWeekDay = date => {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if (typeof date === 'string') {
      return weekdays.indexOf(date) - 1;
    }
    const day = date.getDay();
    return weekdays[day];
  }

  const [state, dispatch] = useReducer(reducer, {
    day: getWeekDay(new Date()),
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    Promise.all([
      Axios.get('/api/days'),
      Axios.get('/api/appointments'),
      Axios.get('/api/interviewers')
    ]).then(all => {
      dispatch({ type: SET_APPLICATION_DATA, value: all });
    });
  }, []);
  
  const setDay = day => dispatch({ type: SET_DAY, value: day });

  // helper func
  const updateObjectInArray = (array, action) => {
    return array.map((item, index) => {
      if (index !== action.index) {
        // This isn't the item we care about - keep it as-is
        return item
      }
  
      // Otherwise, this is the one we want - return an updated value
      return {
        ...item,
        spots: action.item
      }
    })
  };

  // helper func
  const getDayId = (appointmentId) => {
    let dayId = 0;
    if (appointmentId > 20) {
      dayId = 4;
    } else if (appointmentId > 15) {
      dayId = 3;
    } else if (appointmentId > 10) {
      dayId = 2;
    } else if (appointmentId > 5) {
      dayId = 1;
    }

    return dayId;
  };

  function bookInterview(id, interview) {
    return Axios.put(`/api/appointments/${id}`, { interview }).then(
      response => {
        if (response.status >= 200 && response.status < 300) {
          const appointment = {
            ...state.appointments[id],
            interview: { ...interview }
          };

          const appointments = {
            ...state.appointments,
            [id]: appointment
          };

          // check if user is editing existing appointment or adding new
          // only dispatch a change for spot state if adding new
          if (!state.appointments[id].interview) {
            const dayId = getWeekDay(state.day);
            const days = updateObjectInArray(state.days, {index: dayId, item: state.days[dayId].spots - 1});
            dispatch({type: SET_SPOTS, value: days})
          }

          dispatch({ type: SET_INTERVIEW, value: appointments });
        } else {
          console.log(`There was an error. Response was ${response}`);
        }
      }
    );
  };

  function cancelInterview(id) {
    return Axios.delete(`/api/appointments/${id}`).then(response => {
      if (response.status >= 200 && response.status < 300) {
        const appointment = {
          ...state.appointments[id],
          interview: null
        };

        const appointments = {
          ...state.appointments,
          [id]: appointment
        };

        const dayId = getWeekDay(state.day);
        const days = updateObjectInArray(state.days, {index: dayId, item: state.days[dayId].spots + 1});
        dispatch({type: SET_SPOTS, value: days})
        dispatch({ type: SET_INTERVIEW, value: appointments });
      } else {
        console.log(`There was an error. Response was ${response}`);
      }
    });
  };

  // websocket
  useEffect(() => {
    const sock = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    sock.onopen = () => {
      sock.send("ping");
    };
    sock.onmessage = event => {
      // console.log('Messaged recieved:', JSON.parse(event.data));
      if (JSON.parse(event.data).type === SET_INTERVIEW) {
        const { type, id, interview } = JSON.parse(event.data)
        const dayId = getDayId(id);
        
        const appointment = {
          ...state.appointments[id],
          interview: { ...interview }
        };
        
        // check if interview is deleted
        if (!interview) {
          appointment.interview = null;
          const days = updateObjectInArray(state.days, {index: dayId, item: state.days[dayId].spots + 1});
          dispatch({type: SET_SPOTS, value: days})
        }

        // check if user is editing existing appointment or adding new
        // only dispatch a change for spot state if adding new
        if (!state.appointments[id].interview) {
          const days = updateObjectInArray(state.days, {index: dayId, item: state.days[dayId].spots - 1});
          dispatch({type: SET_SPOTS, value: days})
        }

        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        
        dispatch({type: type, value: appointments })
      }
    }

    return () => { sock.close(); };
  }, [state])

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
};

export default useApplicationData;
