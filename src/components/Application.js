import React, { useState, useEffect } from "react";

import Axios from 'axios';

import 'components/Application.scss';
import DayList from './DayList';
import Appointment from './Appointment/';
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

export default function Application() {
  const [state, setState] = useState({
    day: "Monday",
    days: [], 
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({...state, day});

  const appointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);

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

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointments.map(elem => {
          const interview = getInterview(state, elem.interview);
          return <Appointment 
            {...elem} 
            key={elem.id} 
            interview={interview} 
            interviewers={interviewers} 
            bookInterview={bookInterview}
            cancelInterview={cancelInterview}
          />;
        })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
