import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper,
  ToggleButton, 
  ToggleButtonGroup
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// Sample data for full marathon
const fullMarathonData = [
  { id: 1, rank: 1, racerNumber: 'F1001', name: 'John Smith', age: 28, time: '2:45:30', pace: '6:18/km' },
  { id: 2, rank: 2, racerNumber: 'F1002', name: 'Sarah Johnson', age: 32, time: '2:48:15', pace: '6:24/km' },
];

// Sample data for half marathon
const halfMarathonData = [
  { id: 1, rank: 1, racerNumber: 'H2001', name: 'Alex Turner', age: 24, time: '1:15:30', pace: '5:42/km' },
  { id: 2, rank: 2, racerNumber: 'H2002', name: 'Jessica Lee', age: 29, time: '1:17:45', pace: '5:51/km' },
];

const columns = [
  { 
    field: 'rank', 
    headerName: 'Rank', 
    width: 100,
    headerAlign: 'center',
    align: 'center',
  },
  { 
    field: 'racerNumber', 
    headerName: 'Racer #', 
    width: 120,
    headerAlign: 'center',
    align: 'center',
  },
  { 
    field: 'name', 
    headerName: 'Name', 
    width: 200,
    flex: 1 
  },
  { 
    field: 'age', 
    headerName: 'Age', 
    width: 120,
    headerAlign: 'center',
    align: 'center',
  },
  { 
    field: 'time', 
    headerName: 'Time', 
    width: 130,
    headerAlign: 'center',
    align: 'center',
  },
  { 
    field: 'pace', 
    headerName: 'Pace', 
    width: 130,
    headerAlign: 'center',
    align: 'center',
  }
];

const ResultsPage = () => {
  const [selectedDistance, setSelectedDistance] = useState('full');

  const handleDistanceChange = (event, newDistance) => {
    if (newDistance !== null) {
      setSelectedDistance(newDistance);
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 900,
              mb: 2,
              background: 'linear-gradient(90deg, #3FAF5D 0%, #1C4C89 100%)',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            RACE RESULTS
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
            View the results from our latest event
          </Typography>

          <ToggleButtonGroup
            value={selectedDistance}
            exclusive
            onChange={handleDistanceChange}
            aria-label="race distance"
            sx={{ mb: 4 }}
          >
            <ToggleButton 
              value="full" 
              aria-label="full marathon"
              sx={{
                px: 4,
                py: 1.5,
                '&.Mui-selected': {
                  background: 'linear-gradient(90deg, #3FAF5D 0%, #1C4C89 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #3FAF5D 0%, #1C4C89 100%)',
                  }
                }
              }}
            >
              Full Marathon
            </ToggleButton>
            <ToggleButton 
              value="half" 
              aria-label="half marathon"
              sx={{
                px: 4,
                py: 1.5,
                '&.Mui-selected': {
                  background: 'linear-gradient(90deg, #3FAF5D 0%, #1C4C89 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #3FAF5D 0%, #1C4C89 100%)',
                  }
                }
              }}
            >
              Half Marathon
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Paper 
          elevation={0}
          sx={{ 
            height: 635,
            width: '100%',
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.1)',
            '& .MuiDataGrid-root': {
              border: 'none',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid rgba(0,0,0,0.05)',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'rgba(0,0,0,0.02)',
              borderBottom: '1px solid rgba(0,0,0,0.1)',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid rgba(0,0,0,0.1)',
            }
          }}
        >
          <DataGrid
            rows={selectedDistance === 'full' ? fullMarathonData : halfMarathonData}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'rgba(0,0,0,0.02)',
              },
            }}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default ResultsPage;