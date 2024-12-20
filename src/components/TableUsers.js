import { useEffect } from 'react';
import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import { fetchAllUser } from '../Services/UserService';
import ReactPaginate from 'react-paginate';
import ModalAddNew from './ModalAddNew';
import ModalEditUser from './ModalEditUser';
import ModalConfirm from './ModalConfirm';
import _, { debounce } from 'lodash';
import './TableUser.scss';
import { CSVLink } from "react-csv";
import Papa from 'papaparse';
import { toast } from 'react-toastify';

const TableUsers = (props) => {

  const [listUsers, setListUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState([0]);
  const [totalPages, setTotalPages] = useState([0]);

  const [isShow, setShow] = useState(false);
  const [isShowModalEdit, setShowModalEdit] = useState(false);
  const [dataUserEdit, setDataUserEdit] = useState({});

  const [isShowModalDelete, setShowModalDelete] = useState(false);
  const [dataUserDelete, setDataUserDelete] = useState({});

  const [sortBy, setSortBy] = useState("asc");
  const [sortField, setSortField] = useState("id");

  const [keyWord, setKeyWord] = useState("");

  const [dataExport, setDataExport] = useState([]);

  const handleClose = () => {
    setShow(false); 
    setShowModalEdit(false);
    setShowModalDelete(false);
  };
  const handleShow = () => setShow(true);

  const handleUpdateUser = (user) => {
    setListUsers([user, ...listUsers]);
  }

  const handleEditUserFromModal = (user) => {
    let cloneListUsers = _.cloneDeep(listUsers);
    let index = listUsers.findIndex(item => item.id === user.id);
    cloneListUsers[index].first_name = user.first_name;
    setListUsers(cloneListUsers);
  }

  useEffect(() => {
      getUsers(1);
  }, []);
  
  const getUsers = async (page) => {
      let res = await fetchAllUser(page);
      if (res && res.data) {
        // console.log(res);
        setTotalUsers(res.total);
        setListUsers(res.data);
        setTotalPages(res.total_pages);
      }
  }
  
  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
      // const newOffset = (event.selected * itemsPerPage) % items.length;
      // console.log(
      // `User requested page number ${event.selected}, which is offset ${newOffset}`
      // );
      // setItemOffset(newOffset);

      console.log("lib; ", event);
      getUsers(+event.selected + 1);

  };

  const handleEditUser = (user) => {
    // console.log(user)
    setDataUserEdit(user);
    setShowModalEdit(true);
  }

  const  handleDeleteUser = (user) => {
    setShowModalDelete(true);
    setDataUserDelete(user); 
  }

  const handleDeleteUserFromModal = (user) => {
    let cloneListUsers = _.cloneDeep(listUsers);

    cloneListUsers = cloneListUsers.filter(item => item.id !== user.id);
    setListUsers(cloneListUsers);
  }

  const handleSort = (sortBy, sortField) => {
    setSortBy(sortBy);
    setSortField(sortField); 

    let cloneListUsers = _.cloneDeep(listUsers);
    cloneListUsers = _.orderBy(cloneListUsers, [sortField], [sortBy]);  
    setListUsers(cloneListUsers);
  }

  const handleSearch = debounce((event) => {
    console.log(event.target.value);
    let term = event.target.value;
    if (term) {
      let cloneListUsers = _.cloneDeep(listUsers);
      cloneListUsers = cloneListUsers.filter(item => item.email.includes(term));
      // console.log(cloneListUsers);
        setListUsers(cloneListUsers);
    } else {
      getUsers(1);
    }
  }, 2000)

  const getUsersExport =(event, done) => {
    let result = [];
    if (listUsers && listUsers.length > 0) {
      result.push(["Id", "Email", "Fist_name", "Last_name"]);
      listUsers.map((item, index) => {
        let arr=[];
        arr[0] = item.id;
        arr[1] = item.email;
        arr[2] = item.first_name;
        arr[3] = item.last_name;
        result.push(arr);
      })
      setDataExport(result);
      done();
    }

  }

  const handleImportCSV = (event) => {
    if( event.target &&  event.target.files &&  event.target.files[0]) {
      let  file = event.target.files[0];

      if(file.type !== "text/csv") {
        toast.error("Only CSV files are supported!") 
        return;
      }
      // console.log(file);
      Papa.parse(file , {  
        // header: true,                              
        complete: function(results) {
          let rawCSV = results.data;
          if (rawCSV.length > 0 ) {
            if (rawCSV[0] && rawCSV[0].length === 3) { 
              if(rawCSV[0][0] !== "Email" || rawCSV[0][1] !== "First_name" || rawCSV[0][2] !== "Last_name") {
                toast.error("Invalid  Header CSV file");
              } else {
                let result = [];
                rawCSV.map((item, index) => {
                  if(index > 0 && item.length === 3) {
                    let obj = {};
                    obj.email = item[0];
                    obj.first_name = item[1];
                    obj.last_name = item[2];

                    result.push(obj);
                  }
                })
                setListUsers(result);
                console.log("check:", result);

              }

            } else {
              toast.error("Invalid CSV file 1");
            }
          } else {
            toast.error("Invalid CSV file 2");
          }

        }
      })
    }
  }

  return (
  <>
   <div className='my-3 add-new'>
      <span><b>List Users:</b></span>
      <button className='btn btn-success' variant="primary" onClick={handleShow}>
      <i className="fa-solid fa-user-plus"></i> Add</button>
    </div>

    <div className='group-btns'>

      <label for="test" className='btn btn-danger'>
        <i className="fa-solid fa-file-import"></i> Import
      </label>
      <input id='test' type='file' hidden
        onChange={(event) => handleImportCSV(event)}
      />
    <CSVLink
      data={dataExport}
      filename={"my-file.csv"}
      asyncOnClick={true}
      onClick={getUsersExport}  
      className="btn btn-primary"
    >
      <i className="fa-solid fa-file-export"></i> Export
    </CSVLink>
    </div>

    <div className='col-6 my-3'>
      <input className='form-control' placeholder='Search user by email...'
          // value={keyWord}
          onChange={(event) => handleSearch(event) }
      />
    </div>

    <Table striped bordered hover>
      <thead>
        <tr>
          <th>
            <div className='sort-header'>
              <span>ID</span>
              <span>
                <i className="fa-solid fa-arrow-down"
                onClick={() => handleSort("desc", "id")}
                ></i>
                <i className="fa-solid fa-arrow-up"
                onClick={() => handleSort("asc", "id")}
                ></i>
              </span>
            </div>
          </th>
          <th className='sort-header'>Email</th>
          <th>
            <div className='sort-header'>
              <span>First Name</span>
              <span>
                <i className="fa-solid fa-arrow-down"
                onClick={() => handleSort("desc", "first_name")}
                ></i>
                <i className="fa-solid fa-arrow-up"
                onClick={() => handleSort("asc", "first_name")}
                ></i>
              </span>
            </div>
          </th>
          <th>Last Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {listUsers && listUsers.length > 0 &&
            listUsers.map((item, index)  => {
                return (
                    <tr key={`users-${index}`}>
                        <td>{item.id}</td>
                        <td>{item.email}</td>
                        <td>{item.first_name}</td>
                        <td>{item.last_name}</td>
                        <td>
                          <button className='btn btn-warning mx-3' onClick={() => handleEditUser(item)}>Edit</button>
                          <button className='btn btn-danger'onClick={() => handleDeleteUser(item)}>Delete</button>
                        </td>
                    </tr>
                )
            })
        }
      
      </tbody>
    </Table>
    <ReactPaginate
      breakLabel="..."
      nextLabel="next >"
      onPageChange={handlePageClick}
      pageRangeDisplayed={5}
      pageCount={totalPages}
      previousLabel="< previous"
      renderOnZeroPageCount={null}

      pageClassName="page-item"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      containerClassName="pagination"
      activeClassName="active"
    />

    <ModalAddNew
      show = {isShow}
      handleClose = {handleClose}
      handleUpdateUser = {handleUpdateUser}
    />

    <ModalEditUser
      show = {isShowModalEdit}
      handleClose = {handleClose}
      dataUserEdit = {dataUserEdit}
      handleEditUserFromModal = {handleEditUserFromModal}
    />

    <ModalConfirm
      show = {isShowModalDelete}
      handleClose = {handleClose}
      dataUserDelete = {dataUserDelete}
      handleDeleteUserFromModal = {handleDeleteUserFromModal}

    />
  </>
  );
}

export default TableUsers;