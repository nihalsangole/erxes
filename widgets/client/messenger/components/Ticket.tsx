import * as React from 'react';
import Container from './common/Container';
import { __ } from '../../utils';
import Input from './common/Input';
import FileUploader from './common/FileUploader';
import Button from './common/Button';
import { IconCheckInCircle } from '../../icons/Icons';

type Props = {
  isSubmitted: boolean;
  handleSubmit: () => void;
  handleButtonClick: () => void;
};

const Ticket: React.FC<Props> = ({
  handleSubmit,
  isSubmitted,
  handleButtonClick,
}) => {
  const renderSubmitted = () => {
    return (
      <div className="success-wrapper">
        <div className="message">
          <IconCheckInCircle />
          <h3>Your message has been sent</h3>
          <p>Thank you for sharing your thoughts</p>
        </div>
      </div>
    );
  };
  const renderForm = () => {
    return (
      <form id="ticket-form" onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="ticket-form-item">
            <Input id="name" label="Name" placeholder="First name" />
            <Input placeholder="Last name" />
          </div>
          <div className="ticket-form-item">
            <Input id="department" label="Department" />
          </div>
          <div className="ticket-form-item">
            <Input id="computer_id" label="Computer ID" />
          </div>
          <FileUploader />
          <div className="ticket-form-item">
            <Input
              textArea
              id="problem_description"
              label="Describe the problem"
            />
          </div>
        </div>
      </form>
    );
  };

  return (
    <Container
      withBottomNavBar={false}
      title="Ticket"
      persistentFooter={
        !isSubmitted ? (
          <Button form="ticket-form" type="submit" full>
            Submit
          </Button>
        ) : (
          <Button full onClick={handleButtonClick}>
            Continue
          </Button>
        )
      }
    >
      <div className="ticket-container">
        {isSubmitted ? renderSubmitted() : renderForm()}
      </div>
    </Container>
  );
};

export default Ticket;
