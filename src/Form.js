import React, { useEffect, useState } from 'react';
import { userId, role, userName } from './Others/commonExportVariable'
import { api } from './AxiosSetup/axiosDefault';
import { errorHandler } from './Others/errorHandle';

const MyForm = () => {

  const currentDate = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    block: '',
    name: '',
    vendorName: '',
    status: '',
    dateOfEntry: '',
    daysTillDate: '',
    statusOfWork: '',
    remark: '',
  });

  const [entries, setEntries] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [vendorData2, setVendorData2] = useState([]);
  const [gpData, setGpData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [daysTillDate, setDaysTillDate] = useState('');
  const [remark, setRemark] = useState('');
  const [uniqueDates, setUniqueDates] = useState([]);




  const handleRemarkChange = (event) => {
    setRemark(event.target.value);
  };


  const handleDaysChange = (event) => {
    // Use a regular expression to allow only integer values
    const value = event.target.value.replace(/\D/g, '');
    setDaysTillDate(value);
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await api.post('/get-vendors');
        console.log("Vendor Response:", response);

        const result = await errorHandler(response);
        if (result.data && result.data.success) {
          setVendorData(result.data.data || []); // Ensure a default empty array if data is undefined
        } else {
          console.error('Error fetching vendors:', result.data.message);
          // alert(result.data.message);
        }
      } catch (error) {
        console.error('Error fetching vendors:', error);
        alert(error.message);
      }
    };

    fetchVendors();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.post('/get-projects');
        console.log("Projects Response:", response.data);

        const result = await errorHandler(response);
        if (result.data && result.data.success) {
          setProjects(result.data.data || []); // Ensure a default empty array if data is undefined
        } else {
          console.error('Error fetching Projects:', result.data.message);
          // alert(result.data.message);
        }
      } catch (error) {
        console.error('Error fetching Projects:', error);
        alert(error.message);
      }
    };

    fetchProjects();
  }, []);

  const handleChange = (e, fieldType) => {
    const { name, value } = e.target;
    // setFormData({ ...formData, [name]: value });
    let updatedFormData = { ...formData, [name]: value };


    const selectedProject = projects.find((project) => project.name === value);

    if (fieldType === 'project') {
      setGpData(selectedProject.gpName);
      let vendorIds = selectedProject.vendorAssignedTo
      let filteredVendors = vendorData.filter(vendor => vendorIds.includes(vendor._id));
      setVendorData2(filteredVendors)
    }
    if (name === 'workDone' || name === 'scope' || name === 'totalWorkDone') {
      const workDone = parseFloat(updatedFormData.workDone) || 0;
      const scope = parseFloat(updatedFormData.scope) || 1; // Avoid division by zero
      const totalWorkDone = parseFloat(updatedFormData.totalWorkDone) || 0;

      updatedFormData = {
        ...updatedFormData,
        percentage: ((workDone / scope) * 100).toFixed(2),
        totalPercentage: ((totalWorkDone / scope) * 100).toFixed(2),
      };
    }

    setFormData(updatedFormData);




  };

  useEffect(() => {
    let dates = [];
    entries.forEach(item => {
      dates.push(item.dateOfEntry);
    });
    // Filter out unique dates and sort them
    const uniqueDates = Array.from(new Set(dates)).sort();
    setUniqueDates(uniqueDates);
  }, [entries]);
  console.log(uniqueDates)

  const handleAddEntry = () => {
    // Create a copy of entries array and add the current formData
    const updatedEntries = [...entries, { ...formData }];



    setEntries(updatedEntries);

    console.log(updatedEntries)
    // Reset the form data
    setFormData({
      block: '',
      name: '',
      vendorName: '',
      status: '',
      dateOfEntry: '',
      daysTillDate: '',
      statusOfWork: '',
      remark: '',
    });
  };
  const handleSubmit = async () => {
    try {
      // Assuming you have an API endpoint for submitting entries, adjust the URL accordingly
      const response = await api.post('/submit-entries', { entries });
      console.log('Submit Entries Response:', response);

      // Handle the response as needed
      const result = await errorHandler(response);
      if (result.data && result.data.success) {
        // Clear the entries after successful submission
        setEntries([]);
      } else {
        console.error('Error submitting entries:', result.data.message);
        // Handle error appropriately (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error submitting entries:', error);
      // Handle error appropriately (e.g., show an error message)
    }
  };

  return (
    <div className="container mt-5">
      <form className="row g-3">
        <div className="col-sm-2">
          <label htmlFor="block" className="form-label">Project Name</label>
          <select
            className="form-select"
            id="block"
            name="block"
            value={formData.block}
            onChange={(e) => handleChange(e, 'project')}
          >
            <option value="" >Select Project Name</option>
            {projects.map((project) => (
              <option key={project.id} value={project.name}>
                {project.name}
              </option>
            ))}
          </select>
        </div>


        <div className="col-sm-2">
          <label htmlFor="name" className="form-label">GP Name</label>
          <select
            className="form-select"
            id="name"
            name="name"
            value={formData.name} // Assuming gpName is the field in your formData
            onChange={(e) => handleChange(e, 'gp')}
          >
            <option value="" >Select GP Name</option>
            {gpData.map((gp) => (
              <option key={gp.id} value={gp.name}>
                {gp.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-sm-2">
          <label htmlFor="vendorName" className="form-label">Vendor Name</label>
          <select
            className="form-select"
            id="vendorName"
            name="vendorName"
            value={formData.vendorName}
            onChange={(e) => handleChange(e, 'vendor')}
          >
            <option value="" >Select Vendor Name</option>
            {vendorData2.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.vendorName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-sm-2">
          <label htmlFor="scope" className="form-label">Status</label>
          <select
            className="form-select"
            id="status"
            name="status"
            value={formData.scope}
            onChange={(e) => handleChange(e, 'status')}
          >
            <option value="">Select Status</option>
            <option value="Working">Working</option>
            <option value="Not Working">Not Working</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
        </div>
        <div className="col-sm-2">
          <label htmlFor="dateOfEntry" className="form-label">Deployment Date</label>
          <input
            type="date"
            className="form-control"
            id="dateOfEntry"
            name="dateOfEntry"
            value={selectedDate}
            onChange={(e) => handleChange(e, 'dateOfEntry')}
          />
        </div>

        <div className="col-sm-2">
          <label htmlFor="daysTillDate" className="form-label">Day's Till Date</label>
          <input
            type="text"
            className="form-control"
            id="daysTillDate"
            name="daysTillDate"
            value={daysTillDate}
            onChange={handleDaysChange}
            placeholder="Enter Days"
          />
        </div>


        <div className="col-sm-2">
          <label htmlFor="scope" className="form-label">Status of Work</label>
          <select
            className="form-select"
            id="statusOfWork"
            name="statusOfWork"
            value={formData.scope}
            onChange={(e) => handleChange(e, 'statusOfWork')}
          >
            <option value="">Select Status</option>
            <option value="Working">Working</option>
            <option value="Not Working">Not Working</option>

          </select>
        </div>

        <div className="col-sm-2">
          <label htmlFor="remark" className="form-label">Remark</label>
          <input
            type="text"
            className="form-control"
            id="remark"
            name="remark"
            value={remark}
            onChange={handleRemarkChange}
            placeholder="Enter Remark"
          />
        </div>

        <div >
          <br />
          <button type="button" className="btn btn-success" onClick={handleAddEntry}>
            Add
          </button>
        </div>


        <div className="col-sm-12 mt-3">
          <h2>Entries:</h2>
          <div className="container">
            <table className="table">
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Vendor Name</th>
                  <th>Status</th>
                  <th>GP</th>
                  <th>Block</th>
                  {uniqueDates.map(date => (
                    <th key={date} colSpan={2}>
                      {date}
                    </th>

                  ))}

                </tr>
                {uniqueDates.length > 0 && (
                  <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th>Deployment Date</th>
                    <th>Day's till date</th>
                    <th>Status of Work</th>
                    <th>Remarks</th>
                  </tr>
                )}
              </thead>


              <tbody>
                {entries.map((entry, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{entry.vendorName}</td>
                    <td>{entry.name}</td>
                    <td>{entry.block}</td>

                    {uniqueDates.map(date => {
                      const matchingEntry = entries.find(
                        e => e.dateOfEntry === date && e.vendorName === entry.vendorName
                      );

                      return (
                        <React.Fragment key={date}>
                          <td>{entry.dateOfEntry}</td>
                          <td>{entry.daysTillDate}</td>
                          <td>{entry.statusOfWork}</td>
                          <td>{entry.remark}</td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <button type="submit" className="btn btn-primary" style={{ marginRight: "15px" }}>Clear Entry</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default MyForm;


