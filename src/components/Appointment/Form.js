import React, { useState } from 'react';
import InterviewerList from '../InterviewerList';
import Button from '../Button';

export default function Form(props) {
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [studentName, setStudentName] = useState(props.name || "");
  const [error, setError] = useState("")

  const reset = function() {
    setInterviewer(null);
    setStudentName("");
  }

  const cancel = function() {
    props.onCancel();
    reset();
  }

  function validate() {
    if (studentName === "") {
      setError("Student name cannot be blank");
      return;
    }
  
    setError("");
    props.onSave(studentName, interviewer);
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={studentName}
            onChange={event => setStudentName(event.target.value)}
            data-testid="student-name-input"
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList
          interviewers={props.interviewers}
          value={interviewer}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button onClick={() => cancel()} danger>Cancel</Button>
          <Button onClick={() => validate()} confirm>Save</Button>
        </section>
      </section>
    </main>
  );
}
