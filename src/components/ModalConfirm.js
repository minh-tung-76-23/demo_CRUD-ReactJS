import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { deleteUser } from '../Services/UserService';
import { toast } from 'react-toastify';


const ModalConfirm = (props) =>  {
    const {show, handleClose, dataUserDelete, handleDeleteUserFromModal} = props;
    const ConfirmDelete = async () => {
        let res = await deleteUser(dataUserDelete.id);
        if (res && +res.statusCode === 204) {
            toast.success("Deleted successfully!");
            handleClose();
            handleDeleteUserFromModal(dataUserDelete);
        } else {
            toast.error("Error deleting user");
        }
        console.log(res)
    }

  return (
    <>
        <Modal 
            show={show} 
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='body-add-new'> 
                Are you sure you want to delete this user?  <br/>
                Email: <b>{dataUserDelete.email}</b>.
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => ConfirmDelete()}>
            Confirm 
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalConfirm;