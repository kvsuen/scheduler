import React from 'react';

import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';

import './styles.scss';
import useVisualMode from 'hooks/useVisualMode';

export default function Appointment({ 
  id,
  time,
  interview,
  interviewers,
  bookInterview,
  cancelInterview
  }) {

  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const SAVING = 'SAVING';
  const DELETING = 'DELETING';

  const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY);
  
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    
    transition(SAVING);

    bookInterview(id, interview)
      .then(() => transition(SHOW))
      .catch((err) => console.log(err))
  }

  function del() {
    transition(DELETING);
    cancelInterview(id)
      .then(() => transition(EMPTY))
      .catch((err) => console.log(err))
  }

  return (
    <article className="appointment">
      <Header time={time} />

      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show 
          student={interview.student} 
          interviewer={interview.interviewer} 
          onDelete={() => del()}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={interviewers}
          onSave={save}
          onCancel={() => back()}
        />
      )}
      {mode === SAVING && (
        <Status message={'Saving'}/>
      )}
      {mode === DELETING && (
        <Status message={'Deleting'} />
      )}

    </article>
  );
}
