import { useEffect, useReducer } from 'react';
import Axios from 'axios';

const useApplicationData = () => {
  const SET_DAY = 'SET_DAY';
  const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
  const SET_INTERVIEW = 'SET_INTERVIEW';

  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  function reducer(state, action) {
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
          appointments: action.value[0]/*,
          days: action.value[1] */
        };
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }
  
  const setDay = day => dispatch({ type: SET_DAY, value: day });

  useEffect(() => {
    Promise.all([
      Axios.get('/api/days'),
      Axios.get('/api/appointments'),
      Axios.get('/api/interviewers')
    ]).then(all => {
      dispatch({ type: SET_APPLICATION_DATA, value: all });
    });
  }, []);

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

          const days = {
            ...state.days,
            spots: 10
          };

          const arr = [appointments, days]

          dispatch({ type: SET_INTERVIEW, value: arr });
        } else {
          console.log(`There was an error. Response was ${response}`);
        }
      }
    );
  }

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

        dispatch({ type: SET_INTERVIEW, value: appointments });
      } else {
        console.log(`There was an error. Response was ${response}`);
      }
    });
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
};

export default useApplicationData;
