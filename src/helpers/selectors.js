export function getAppointmentsForDay(state, day) {
  const appointments = [];

  const filteredDay = state.days.filter(elem => elem.name === day)

  if (filteredDay.length === 0) {
    return appointments;
  } else {
    filteredDay[0].appointments.map(id => appointments.push(state.appointments[id]))
  }

  return appointments;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const interviewerId = interview.interviewer;
  const { student } = interview;

  const interviewer = state.interviewers[interviewerId];

  const result = {
    student,
    interviewer
  }

  return result;
}