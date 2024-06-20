import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Container, Paper } from '@mui/material';
import { useState, useEffect } from 'react';

export default function Client() {
  const [idNumber, setIdNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankBranch, setBankBranch] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [clients, setClients] = useState([]);
  const [clientById, setClientById] = useState(null);
  const [error, setError] = useState(null);

  const handleClick = (e) => {
    e.preventDefault();
    const client = { idNumber, bankName, bankBranch, accountHolderName, mobileNumber, email };
    console.log(client);
    fetch("http://localhost:8080/client/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client)
    }).then(() => {
      console.log("New client added");
      fetchClients(); // Fetch clients after adding a new one
    });
  };

  const fetchClients = () => {
    fetch("http://localhost:8080/client/getAll")
      .then(res => res.json())
      .then((result) => {
        setClients(result);
      });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  console.log(clients)

  const handleSearch = () => {
    fetch(`http://localhost:8080/client/${idNumber}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setClientById(data);
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
        setClientById(null);
      });
  };

  const handleDelete = () => {
    fetch(`http://localhost:8080/client/${idNumber}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(() => {
      console.log("Client deleted");
      fetchClients(); 
      setClientById(null);
    }).catch((error) => {
      setError(error.message);
    });
  };

  const paperStyle = { padding: '50px 20px', width: 600, margin: "20px auto" };
  return (
    <>
      <Container>
        <Paper elevation={3} style={paperStyle}>
          <h2 style={{ color: 'blue' }}>Add a new Client</h2>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1 },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField id="outlined-basic" label="Bank name" variant="outlined"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
            <TextField id="outlined-basic" label="Bank branch" variant="outlined"
              value={bankBranch}
              onChange={(e) => setBankBranch(e.target.value)}
            />
            <TextField id="outlined-basic" label="Account Holder Name" variant="outlined"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
            />
            <TextField id="outlined-basic" label="Mobile number" variant="outlined"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
            <TextField id="outlined-basic" label="Email" variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Button variant="contained" onClick={handleClick}>Submit</Button>
        </Paper>

        <Paper elevation={3} style={paperStyle}>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1 },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField id="outlined-basic" label="Search by Id" variant="outlined"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
            />
          </Box>
          <Button style={{ marginRight: '10px' }} variant="contained" onClick={handleSearch}>Search</Button>
          <Button variant="contained" onClick={handleDelete}>Delete</Button>
        </Paper>

        {error && <p>Error: {error}</p>}
        {clientById && (
          <Paper elevation={3} style={paperStyle}>
            <h2>Client searched by id Details</h2>
            <p>Id: {clientById.accountNumber}</p>
            <p>Bank Name: {clientById.bankName}</p>
            <p>Bank Branch: {clientById.bankBranch}</p>
            <p>Account Holder Name: {clientById.accountHolderName}</p>
            <p>Mobile Number: {clientById.mobileNumber}</p>
            <p>Email: {clientById.email}</p>
          </Paper>
        )}

        <h2>Clients</h2>
        <Paper elevation={3} style={paperStyle}>
          {clients.map(client => (
            <Paper elevation={6} style={{ margin: '10px', padding: "15px", textAlign: 'left' }} key={client.idNumber}>
              Id: {client.accountNumber}<br />
              Bank Name: {client.bankName}<br />
              Bank Branch: {client.bankBranch} <br />
              Account Name: {client.accountHolderName}<br />
              Mobile Number: {client.mobileNumber}<br />
              Email: {client.email}
            </Paper>
          ))}
        </Paper>
      </Container>
    </>
  );
}
