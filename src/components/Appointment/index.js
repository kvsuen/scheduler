import React from 'react';

import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';

import './styles.scss';
import useVisualMode from 'hooks/useVisualMode';
import Error from './Error';

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
  const CONFIRM = 'CONFIRM';
  const DELETING = 'DELETING';
  const EDIT = 'EDIT';
  const ERROR_SAVE = 'ERROR_SAVE';
  const ERROR_DELETE = 'ERROR_DELETE';

  const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY);
  
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    if (!interview.student || !interview.interviewer) {
      transition(ERROR_SAVE, true)
    } else {
      transition(SAVING, true);
      bookInterview(id, interview)
        .then(() => transition(SHOW))
        .catch((err) => {
          transition(ERROR_SAVE, true);
          console.log(err);
        });
    }
  }

  function deleteItem() {
    transition(DELETING, true);
    cancelInterview(id)
      .then(() => transition(EMPTY))
      .catch((err) => {
        transition(ERROR_DELETE, true);
        console.log(err);
      });
  }

  return (
    <article className="appointment">
      <Header time={time} />

      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show 
          student={interview.student} 
          interviewer={interview.interviewer} 
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
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
      {mode === CONFIRM && (
        <Confirm 
          message={'Delete the appointment?'}
          onCancel={() => back()}
          onConfirm={() => deleteItem()}
        />
      )}
      {mode === EDIT && (
        <Form
        name={interview.student}
        interviewer={interview.interviewer.id}
        interviewers={interviewers}
        onSave={save}
        onCancel={() => back()}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error 
          message={'Error with saving appointment, please try again.'}
          onClose={() => back()} 
        />
      )}
      {mode === ERROR_DELETE && (
        <Error 
          message={'Error with deleting, please try again.'}
          onClose={() => back()} 
        />
      )}
    </article>
  );
}
