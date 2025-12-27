import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { KanbanBoard } from './components/KanbanBoard';
import { Text, Container } from '@mantine/core';
import { EquipmentList } from './components/EquipmentList';


const TeamsList = () => <Container><Text size="xl">Teams List (Coming Soon)</Text></Container>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<KanbanBoard />} />
        <Route path="equipment" element={<EquipmentList />} />
        <Route path="teams" element={<TeamsList />} />
      </Route>
    </Routes>
  );
}

export default App;