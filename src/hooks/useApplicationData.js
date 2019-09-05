import { useEffect, useReducer } from 'react';
import Axios from 'axios';

const useApplicationData = () => {
  const SET_DAY = 'SET_DAY';
  const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
  const SET_INTERVIEW = 'SET_INTERVIEW';

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
          appointments: action.value[0],
          days: action.value[1]
        };
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
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
  const getDayId = id => {
    let dayId = 0;
    if (id > 20) {
      dayId = 4;
    } else if (id > 15) {
      dayId = 3;
    } else if (id > 10) {
      dayId = 2;
    } else if (id > 5) {
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

          const dayId = getDayId(id);
          // only change spots if saving a new appointment, rather than on edit
          let spots = state.days[dayId].spots;
          if (!state.appointments[id].interview) {
            spots = state.days[dayId].spots - 1;
          }

          const days = updateObjectInArray(state.days, {index: dayId, item: spots});
          dispatch({ type: SET_INTERVIEW, value: [appointments, days] });
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

        const dayId = getDayId(id);
        const days = updateObjectInArray(state.days, {index: dayId, item: state.days[dayId].spots + 1});
        dispatch({ type: SET_INTERVIEW, value: [appointments, days] });
      } else {
        console.log(`There was an error. Response was ${response}`);
      }
    });
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
};

export default useApplicationData;
