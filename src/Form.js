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
    scope: '',
    dateOfEntry: currentDate,
    workDone: '',
    labour: '',
    totalWorkDone: '',
  });

  const [entries, setEntries] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [gpData, setGpData] = useState([]);

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

// Modify your existing code to fetch GPs

useEffect(() => {
  const fetchGPs = async () => {
    try {
      const response = await api.post('/get-gps');
      console.log("GP Response:", response.data);

      const result = await errorHandler(response);
      if (result.data && result.data.success) {
        setGpData(result.data.data || []); // Ensure a default empty array if data is undefined
      } else {
        console.error('Error fetching GPs:', result.data.message);
        // alert(result.data.message);
      }
    } catch (error) {
      console.error('Error fetching GPs:', error);
      alert(error.message);
    }
  };

  fetchGPs();
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const [uniqueDates, setUniqueDates] = useState([]);

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

    // Group entries by vendor name, gp, and block
    // const groupedEntries = updatedEntries.reduce((acc, entry) => {
    //   const key = `${entry.vendorName}/${entry.gp}/${entry.block}`;
    //   acc[key] = acc[key] || [];
    //   acc[key].push({
    //     dateOfEntry: entry.dateOfEntry,
    //     labour: entry.labour,
    //     totalWorkDone: entry.totalWorkDone,
    //   });
    //   return acc;
    // }, {});

    // const groupedEntriesArray = Object.values(groupedEntries);

    //   console.log(groupedEntriesArray)

    // Set the state with the updated entries and combined data
    setEntries(updatedEntries);

    console.log(updatedEntries)
    // Reset the form data
    setFormData({
      block: '',
      name: '',
      vendorName: '',
      scope: '',
      dateOfEntry: currentDate,
      workDone: '',
      labour: '',
      totalWorkDone: '',
    });
  };


  //   const generateReport = () => {
  //     // Group entries by date
  //     const groupedEntries = updatedEntries.reduce((acc, entry) => {
  //         const key = `${entry.vendorName}-${entry.gp}-${entry.block}`;
  //         acc[key] = acc[key] || [];
  //         acc[key].push({
  //           dateOfEntry: entry.dateOfEntry,
  //           labour: entry.labour,
  //           totalWorkDone: entry.totalWorkDone,
  //         });
  //         return acc;
  //       }, {});

  //     console.log(groupedEntries)

  //     // Get unique dates
  //     const dates = Object.keys(groupedEntries);
  //     console.log(dates)
  //     // Generate the report table
  //     const reportTable = (
  //       <table className="table">
  //         <thead>
  //           <tr>
  //             <th>S.No.</th>
  //             <th>Block</th>
  //             <th>GP</th>
  //             <th>Vendor</th>
  //             <th>Work Done As On Date</th>
  //             {dates.map((date, index) => (
  //               <th key={index}>{date}</th>
  //             ))}
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {entries.map((entry, index) => (
  //             <tr key={index}>
  //               <td>{index + 1}</td>
  //               <td>{entry.block}</td>
  //               <td>{entry.gp}</td>
  //               <td>{entry.vendorName}</td>
  //               <td>{entry.workDone}</td>
  //               {dates.map((date, innerIndex) => (
  //                 <td key={innerIndex}>
  //                   {groupedEntries[date]
  //                     .filter((groupedEntry) => groupedEntry.dateOfEntry === date)
  //                     .map((groupedEntry, innerInnerIndex) => (
  //                       <div key={innerInnerIndex}>
  //                         Labour: {groupedEntry.labour}, Work Done: {groupedEntry.totalWorkDone}
  //                       </div>
  //                     ))}
  //                 </td>
  //               ))}
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     );

  //     return reportTable;
  //   };

  return (
    <div className="container mt-5">
      <form className="row g-3">
        <div className="col-sm-2">
          <label htmlFor="block" className="form-label">Block</label>
          <input
            type="text"
            className="form-control"
            id="block"
            name="block"
            value={formData.block}
            onChange={handleChange}
            placeholder="Enter Field Block"
          />
        </div>

        <div className="col-sm-2">
          <label htmlFor="name" className="form-label">GP Name</label>
          <select
            className="form-select"
            id="name"
            name="name"
            value={formData.name} // Assuming gpName is the field in your formData
            onChange={handleChange}
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
            onChange={handleChange}
          >
            <option value="" >Select Vendor Name</option>
            {vendorData.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.vendorName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-sm-2">
          <label htmlFor="scope" className="form-label">Scope</label>
          <input
            type="text"
            className="form-control"
            id="scope"
            name="scope"
            value={formData.scope}
            onChange={handleChange}
            placeholder="Enter Scope"
          />
        </div>

        <div className="col-sm-2">
          <label htmlFor="layoutDone" className="form-label">Layout Done</label>
          <select
            className="form-select"
            id="layoutDone"
            name="layoutDone"
            value={formData.layoutDone}
            onChange={handleChange}
            placeholder="Yes or No"
          >
            <option value="" >Select Layout Done</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>


        <div className="col-sm-2">
          <label htmlFor="dateOfEntry" className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            id="dateOfEntry"
            name="dateOfEntry"
            value={formData.dateOfEntry}
            onChange={handleChange}
            readOnly // Make the input read-only
          />
        </div>


        <div className="col-sm-2">
          <label htmlFor="workDone" className="form-label">Work Done As On Date</label>
          <input
            type="text"
            className="form-control"
            id="workDone"
            name="workDone"
            value={formData.workDone}
            onChange={handleChange}
            placeholder="Enter Work Done As On Date"
          />
        </div>

        <div className="col-sm-2">
          <label className="form-label">Resource Tab</label>
          <input
            type="text"
            className="form-control"
            id="labour"
            name="labour"
            value={formData.labour}
            onChange={handleChange}
            placeholder="Enter Labour"
          />
        </div>

        <div className="col-sm-2">
          <label htmlFor="totalWorkDone" className="form-label">Total Work Done</label>
          <input
            type="text"
            className="form-control"
            id="totalWorkDone"
            name="totalWorkDone"
            value={formData.totalWorkDone}
            onChange={handleChange}
            placeholder="Enter Total Work Done"
          />
        </div>

        <div className="col-sm-2">
          <button type="button" className="btn btn-success" onClick={handleAddEntry}>
            Add
          </button>
        </div>


        {/*    
        <div>
          <h2>Entries:</h2>
          <pre>{JSON.stringify(entries, null, 2)}</pre>
        </div> */}
        <div className="col-sm-12 mt-3">
          <h2>Entries:</h2>
          <div className="container">
            <table className="table">
              <thead>
                <tr>
                  <th>Vendor Name</th>
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
                    <th>Labour</th>
                    <th>Total Work Done</th>
                  </tr>
                )}
              </thead>

              
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.vendorName}</td>
                    <td>{entry.name}</td>
                    <td>{entry.block}</td>
                    {uniqueDates.map(date => {
                      const matchingEntry = entries.find(
                        e => e.dateOfEntry === date && e.vendorName === entry.vendorName
                      );
                      return (
                        <React.Fragment key={date}>
                          <td>{matchingEntry ? matchingEntry.labour : ''}</td>
                          <td>{matchingEntry ? matchingEntry.totalWorkDone : ''}</td>
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
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default MyForm;


