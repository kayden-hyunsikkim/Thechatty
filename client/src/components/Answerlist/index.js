import React from 'react';

const styles = {
    font : {
      color: 'white',
      fontSize:'20px'
    }
}


const AnswerList = ({ answers, title }) => {
  if (!answers.length) {
    return <h3> </h3>;
  }

  return (
    <div style ={styles.font}>
      <h3>{title}</h3>
      {answers &&
        answers.map((answer) => (
          <div key={answer._id} className="mb-3">
            <p className=" p-2 m-0">
              {answer.answer}
              <span style={{ fontSize: '1rem', float:'right'}}>
              {answer.createdAt}
              </span>
            </p>
    
          </div>
        ))}
    </div>
  );
};

export default AnswerList;
