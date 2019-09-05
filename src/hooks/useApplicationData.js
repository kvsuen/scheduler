import { useState, useEffect } from 'react';
import Axios from 'axios'

const useApplicationData = () => {
  const [state, setState] = useState({
    day: "Monday",
    days: [], 
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({...state, day});

  useEffect(() => {
    Promise.all([
      Axios.get("/api/days"),
      Axios.get("/api/appointments"),
      Axios.get("/api/interviewers")
    ])
      .then(all => {
        setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
      })
  }, []);

  function bookInterview(id, interview) {
    return Axios.put(`/api/appointments/${id}`, {interview})
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          const appointment = {
            ...state.appointments[id],
            interview: { ...interview }
          };
      
          const appointments = {
            ...state.appointments,
            [id]: appointment
          };
      
          setState({...state, appointments})
        } else {
          console.log(`There was an error. Response was ${response}`);
        }
      });
  };

  function cancelInterview(id) {
    return Axios.delete(`/api/appointments/${id}`)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          const appointment = {
            ...state.appointments[id],
            interview: null
          };
      
          const appointments = {
            ...state.appointments,
            [id]: appointment
          };
      
          setState({...state, appointments});
        } else {
          console.log(`There was an error. Response was ${response}`);
        }
      });
  };

  return ( 
    {
      state,
      setDay,
      bookInterview,
      cancelInterview
    }
   );
}
 
export default useApplicationData;