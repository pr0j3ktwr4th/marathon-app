import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper,
  ToggleButton, 
  ToggleButtonGroup,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// Sample data for full marathon
const fullMarathonData = [
  { id: 1, rank: 1, racerNumber: 'F1001', name: 'John Smith', firstName: 'John', age: 28, time: '2:45:30', pace: '6:18/km' },
  { id: 2, rank: 2, racerNumber: 'F1002', name: 'Sarah Johnson', firstName: 'Sarah', age: 32, time: '2:48:15', pace: '6:24/km' },
];

// Sample data for half marathon
const halfMarathonData = [
  { id: 1, rank: 1, racerNumber: 'H2001', name: 'Alex Turner', firstName: 'Alex', age: 24, time: '1:15:30', pace: '5:42/km' },
  { id: 2, rank: 2, racerNumber: 'H2002', name: 'Jessica Lee', firstName: 'Jessica', age: 29, time: '1:17:45', pace: '5:51/km' },
];

// Desktop (full) columns - compact widths
const desktopColumns = [
  { field: 'rank', headerName: 'Rank', width: 80, headerAlign: 'center', align: 'center', cellClassName: 'col-rank', flex: 0 },
  { field: 'racerNumber', headerName: '#', width: 80, headerAlign: 'center', align: 'center', flex: 0 },
  // name allowed to grow more than other columns
  { field: 'name', headerName: 'Name', minWidth: 140, headerAlign: 'left', align: 'left', cellClassName: 'col-name', flex: 2 },
  { field: 'age', headerName: 'Age', width: 60, headerAlign: 'center', align: 'center', flex: 0 },
  { field: 'time', headerName: 'Time', width: 90, headerAlign: 'center', align: 'center', cellClassName: 'col-time', flex: 0 },
  { field: 'pace', headerName: 'Pace', width: 90, headerAlign: 'center', align: 'center', flex: 0 }
];

// Mobile (compact) columns - minimal widths and ellipsize name
const mobileColumns = [
  { field: 'rank', headerName: 'Rank', width: 70, headerAlign: 'center', align: 'center', cellClassName: 'col-rank' },
  { field: 'racerNumber', headerName: '#', width: 70, headerAlign: 'center', align: 'center' },
  { field: 'firstName', headerName: 'Name', minWidth: 100, maxWidth: 180, headerAlign: 'left', align: 'left', cellClassName: 'col-name' },
  { field: 'time', headerName: 'Time', width: 90, headerAlign: 'center', align: 'center', cellClassName: 'col-time' }
];

const ResultsPage = () => {
  const [selectedDistance, setSelectedDistance] = useState('full');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // DataGrid props that differ between mobile and desktop
  const gridDesktopProps = {
    disableColumnSelector: false,
    disableColumnFilter: false,
    disableColumnMenu: false,
  };
  const gridMobileProps = {
    disableColumnSelector: true,
    disableColumnFilter: true,
    disableColumnMenu: true,
  };

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
            orientation={isMobile ? 'vertical' : 'horizontal'}
            sx={{ mb: 4, width: isMobile ? '100%' : 'auto', '& .MuiToggleButton-root': { width: isMobile ? '100%' : 'auto' } }}
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
            height: isMobile ? 'auto' : 635,
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
            columns={isMobile ? mobileColumns : desktopColumns}
            pageSize={isMobile ? 5 : 10}
            rowsPerPageOptions={isMobile ? [5] : [10]}
            autoHeight={isMobile}
            disableSelectionOnClick
            density="compact"
            {...(isMobile ? gridMobileProps : gridDesktopProps)}
            sx={{
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'rgba(0,0,0,0.02)',
              },
              '& .MuiDataGrid-cell': {
                py: 0.4,
                px: 0.75,
              },
              '& .MuiDataGrid-cell.col-rank': {
                px: 2.5,
                fontWeight: 700,
              },
              '& .MuiDataGrid-cell.col-name': {
                px: 0.5,
                py: 0.3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%'
              },
              '& .MuiDataGrid-cell.col-time': {
                px: 0.5,
                py: 0.3,
                textAlign: 'center'
              },
              // Truncate header text if it overflows
              '& .MuiDataGrid-columnHeaderTitle': {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              },
              '& .MuiDataGrid-columnHeader': {
                py: 0.5,
              }
            }}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default ResultsPage;