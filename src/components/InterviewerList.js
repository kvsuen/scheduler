import React from 'react';
import PropTypes from 'prop-types';

import InterviewerListItem from './InterviewerListItem'
import 'components/InterviewerList.scss';

export default function InterviewerList(props) {
  InterviewerList.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
  };

  
  const interviewers = props.interviewers.map(interviewer => {
    return (
      <InterviewerListItem
        key={interviewer.id}
        name={interviewer.name}
        avatar={interviewer.avatar}
        setInterviewer={event => props.onChange(interviewer.id)}
        // props.value makes it depend on the parent value, which happens to be STATE
        selected={interviewer.id === props.value}
      />
    )
  })
    return (
      <section className="interviewers">
        <h4 className="interviewers__header text--light">Interviewer</h4>
        <ul className="interviewers__list">
          {interviewers}
        </ul>
      </section>
  );
}