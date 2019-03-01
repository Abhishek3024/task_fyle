import React, { Component } from 'react';

//Entities required to change the unicode entities into normal text
import { XmlEntities as Entities } from 'html-entities';

//lodash is used to shuffle the correct_anwer and incorrect_answer
import _ from 'lodash';

class App extends Component {
  
  state = {
    loading: true,
    questions:[],
    selected:[false,false,false,false,false,false,false,false,false,false],
    submitted:false,
    correct: null
  };

  //api calling for json data
  async componentDidMount() {
    const url = "https://opentdb.com/api.php?amount=10";
    const response = await fetch(url);
    const data = await response.json();
    const questions = data.results.map(question => {
      const currentQuestion = { ...question };
      const answers = [question.correct_answer, ...question.incorrect_answers];
      currentQuestion.options = _.shuffle(answers);
      return currentQuestion;
    });
    //in state we got a question along with shuffled answers.
    
    this.setState({ questions });
  }

//function for the selection of answer from the options given
  setAnswer = (e) => {
    const index = e.target.name;
    const selected = [...this.state.selected];
    if (this.state.questions[index].correct_answer === e.target.value) {
      selected[index] = true;
    } else {
      selected[index] = false;
    }

    this.setState({ selected });
  }

//to submit the form
  submit = (e) => {
    e.preventDefault();
    const { selected } = this.state;

    let correct = selected.filter(value => value).length;
    this.setState({ 
      submitted: true,
      correct: correct
    })

  }
//on click the result sheet we need to refresh the page and given a new set of questions
  handleClick = (e) => {
    window.location.reload();
  }

  render() { 
    const entities = new Entities();
    const {questions}= this.state
    const questionList = questions.map((question,index) => {
      // console.log(question.options, question.correct_answer);
        return(
            <div className="questions" key={index}>             
               <div className="question"><b>{index+1}.{entities.decode(question.question)}</b></div>

               {question.options.length === 2 ? (
                  <div onChange={this.setAnswer}>
                    <label>
                      <input type="radio" 
                        value={question.options[0]}
                        name={index}
                      />{entities.decode(question.options[0])}
                    </label>
                    <br />
                    <label>
                      <input type="radio" 
                        value={question.options[1]}
                        name={index}
                      />{entities.decode(question.options[1])}
                    </label>
                  </div>  
                ) : (
                  <div onChange={this.setAnswer}>
                      <label>
                      <input type="radio" 
                        value={question.options[0]}
                        name={index}
                      />{entities.decode(question.options[0])}
                    </label><br />
                    <label>
                      <input type="radio" 
                        value={question.options[1]}
                        name={index}
                      />{entities.decode(question.options[1])}
                    </label>
                    <br />
                    <label>
                      <input type="radio" 
                        value={question.options[2]}
                        name={index}
                      />{entities.decode(question.options[2])}
                    </label>
                    <br />
                    <label>
                      <input className="input" type="radio" 
                        value={question.options[3]}
                        name={index}
                      />{entities.decode(question.options[3])}
                    </label>
                  </div> 
                )}     
            </div>
          )
      });
    
      return(
        <div>
          {this.state.Loading || !this.state.questions ? (
            <div>Loading...</div>
            ) : (
              <div>
              {!this.state.submitted ? (
                <div>
                  <h1 className="maintitle">CHECK YOUR GENERAL KNOWLEDGE...</h1>
                    <form className="form " onSubmit={this.submit}>
                      {questionList}
                      <button className="button" type="submit">Submit</button>
                    </form>
                  </div>
                ) : (
                <div>
                  <h1 className="maintitle">NOW IT'S RESULT TIME...</h1>
                  <div className="container submit">
                    <h2 className="question2">Result</h2>
                    <p className="red">You have corrected <span className="green">{ this.state.correct }</span> out 10 questions</p>
                    <img className="image" src={"https://media.giphy.com/media/fxsqOYnIMEefC/giphy.gif"} alt="Congratulation" /> <br />
                    <button className="button2" type="submit" onClick={this.handleClick}>You can try it again!!!</button>
                  </div>
                </div>
              )}
              </div>
            )}        
        </div>
      )
    }
  }


export default App;
