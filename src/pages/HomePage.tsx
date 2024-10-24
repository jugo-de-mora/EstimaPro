import React, { useState } from 'react';
import { Container, Box, Button, Menu, MenuItem, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const clients = [
  { name: "Universidad El Bosque", creationDate: "6 abr 2024", creator: "William Vera" },
  { name: "Universidad Los Andes", creationDate: "6 abr 2024", creator: "William Vera" },
  { name: "Gimnasio Moderno", creationDate: "6 abr 2024", creator: "William Vera" },
  { name: "Universidad Pedagógica", creationDate: "6 abr 2024", creator: "William Vera" },
];

interface Client {
  name: string;
  creationDate: string;
  creator: string;
}

const handleClick = (event: React.MouseEvent<HTMLButtonElement>, client: Client): void => {
  // Lógica para manejar el click
  console.log(client.name);
};

function HomePage() {
  const [anchorEl, setAnchorEl] = useState<null>();
  const [selectedClient, setSelectedClient] = useState<Client>();

  const handleClick = (event: any, client: Client): void => {
    setAnchorEl(event.currentTarget);
    setSelectedClient(client);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>

      {/* Main Content (Contenido a la derecha) */}
      <Box sx={{ padding: '20px', flexGrow: 1 }}>
        <TextField label="Buscar" variant="outlined" fullWidth style={{ marginBottom: '20px' }} />

        <TableContainer component={Paper} style={{backgroundColor: "#c2edce"}}>
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
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.creationDate}</TableCell>
                  <TableCell>{client.creator}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e: any) => handleClick(e, client)}>
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
    </Box>
  );
}

export default HomePage;
