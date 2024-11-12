import React from 'react';
import { Container, Box, Button, Menu, MenuItem, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';


const clients = [
  { name: "Universidad El Bosque", creationDate: "6 abr 2024", creator: "William Vera" },
  { name: "Universidad Los Andes", creationDate: "6 abr 2024", creator: "William Vera" },
  { name: "Gimnasio Moderno", creationDate: "6 abr 2024", creator: "William Vera" },
  { name: "Universidad Pedagógica", creationDate: "6 abr 2024", creator: "William Vera" },
];

function App() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedClient, setSelectedClient] = React.useState(null);

  const handleClick = (event:any, client:any) => {
    setAnchorEl(event.currentTarget);
    setSelectedClient(client);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Box sx={{ width: '200px', backgroundColor: '#a7d6a0', padding: '20px', height: '100vh' }}>
        <Button variant="contained" style={{ marginBottom: '10px' }}>+ Crear</Button>
        <Button variant="contained" style={{ marginBottom: '10px' }}>Inicio</Button>
        <Button variant="contained">Reciente</Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: '20px' }}>
        <TextField label="Buscar" variant="outlined" fullWidth style={{ marginBottom: '20px' }} />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre del cliente</TableCell>
                <TableCell>Fecha de creación</TableCell>
                <TableCell>Creador</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.name}>
                  <TableCell><a href="https://es.wikipedia.org/wiki/Wikipedia:Portada">{client.name}</a></TableCell>
                  <TableCell>{client.creationDate}</TableCell>
                  <TableCell>{client.creator}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleClick(e, client)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleClose}>Abrir en otra pestaña</MenuItem>
                      <MenuItem onClick={handleClose}>Renombrar</MenuItem>
                      <MenuItem onClick={handleClose}>Eliminar</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

export default App;