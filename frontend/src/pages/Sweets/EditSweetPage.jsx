import { useParams } from 'react-router-dom';
import SweetForm from '../../components/Sweets/SweetForm';

const EditSweetPage = () => (
  <div className="max-w-2xl mx-auto">
    <h1 className="text-3xl font-bold mb-6">Edit Sweet</h1>
    <SweetForm isEdit />
  </div>
);

export default EditSweetPage;