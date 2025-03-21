import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const About = () => {
  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <h1 className="text-center mb-4">О системе учёта долгов</h1>
          <Card className="shadow">
            <Card.Body>
              <Card.Title className="mb-3">Возможности системы</Card.Title>
              <Card.Text>
                Наша система учёта долгов позволяет удобно вести список всех должников,
                добавлять и редактировать записи, автоматически пересчитывать общую сумму
                долгов и вносить изменения одним нажатием. Вы можете:
              </Card.Text>
              <ul>
                <li>Добавлять новых должников с указанием имени и суммы;</li>
                <li>Редактировать данные о должниках и суммах;</li>
                <li>Добавлять или вычитать средства из долга;</li>
                <li>Автоматически отслеживать итоговую сумму задолженности;</li>
                <li>Вести комментарии к каждому изменению.</li>
              </ul>
              <Card.Text>
                Система предоставляет простой и интуитивно понятный интерфейс,
                позволяющий оперативно обновлять информацию и следить за всеми изменениями
                в режиме реального времени. Для каждого должника вы можете просмотреть
                историю операций, даты, а также комментарии.
              </Card.Text>
              <Card.Text>
                Дополнительно доступна функция поиска, которая облегчает работу
                с большим количеством записей. Просто введите имя должника или комментарий,
                и система отобразит все соответствующие результаты.
              </Card.Text>
              <Card.Text className="mb-0">
                В итоге, наша система учёта долгов поможет вам быстро и эффективно управлять
                финансами и никогда не упустить важные детали!
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
