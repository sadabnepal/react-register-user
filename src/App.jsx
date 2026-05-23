import { useState } from 'react';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import SuccessScreen from './components/SuccessScreen/SuccessScreen';

export default function App() {
  const [registered, setRegistered] = useState(null);

  if (registered) {
    return (
      <SuccessScreen
        fields={registered}
        onReset={() => setRegistered(null)}
      />
    );
  }

  return <RegistrationForm onSuccess={setRegistered} />;
}
