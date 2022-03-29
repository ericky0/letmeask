import logoImg from '../assets/images/logo.svg'
import '../styles/room.scss'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { useNavigate, useParams } from 'react-router-dom'
import { Question } from '../components/Question'
import { useRoom } from '../hooks/useRoom'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import { database } from '../services/firebase'

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const params = useParams<RoomParams>()
  const roomId = params.id!;
  const navigate = useNavigate();
  const { title, questions } = useRoom(roomId)

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true
    });
  }  

  async function handleDeleteQuestion(questionId: string){
    if(window.confirm('tem certeza que deseja excluir esta pergunta?')){
      await database.ref(`/rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })

    navigate('/')
  }

  

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="LetMeAsk Logo" />
          <div>          
            <RoomCode code={params.id!}/>
           <Button 
            isOutlined
            onClick={handleEndRoom}
           > Encerrar sala </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span> {questions.length} pergunta(s) </span> }
        </div> 

              <div className="question-list">
                {questions.map(question => {
                  return (
                    <Question 
                      key={question.id}
                      content={question.content}
                      author={question.author}
                      isHighlighted={question.isHighlighted}
                      isAnswered={question.isAnswered}
                    >

                     {!question.isAnswered && (
                       <>
                        <button
                          type="button"
                          onClick={() => handleCheckQuestionAsAnswered(question.id)}
                        >
                        <img src={checkImg} alt="marcar pergunta como respondida"/>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleHighlightQuestion(question.id)}
                        >
                          <img src={answerImg} alt="destaque à pergunta"/>
                        </button>                        
                       </>
                     )} 

                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        <img src={deleteImg} alt="remover pergunta"/>
                      </button>
                    </Question>
                  )
                })}
              </div>


      </main>
    </div>
  )
}