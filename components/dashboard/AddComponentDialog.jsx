import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import { useSWRConfig } from 'swr'
import useMyQueries from "../../hooks/useMyQueries.jsx"
import axios from 'axios'


const AddComponentDialog = (props, ref) => {
    const theme = useTheme()
    const [displayName, setDisplayName] = useState("")
    const [displayFormat, setDisplayFormat] = useState("DataGrid")
    const [query, setQuery] = useState("")
    const [queryError, setQueryError] = useState(false)
    const [disable, setDisabled] = useState(true)
    const [open, setOpen] = useState(false)
    const {myQueries, isLoading, isError} = useMyQueries()
    const { mutate } = useSWRConfig()

    const handleClickOpen = () => {
      setOpen(true);
    }

    const handleClose = () => {
      setOpen(false);
    }

    useImperativeHandle(ref, () => ({
      handleOpenClick() {
        handleClickOpen()
      }
    }), [])


    const formValidation = () => {   
      setQueryError(false)

      if (myQueries?.Items?.length === 0) setQueryError(true)

      if (displayName == ""
          || query === ""
          ) {
        return true
      } else {
        return false
      }
    }
  

    useEffect(() => {
      setDisabled(formValidation())
    }, [displayName, query, myQueries])
  

    const addComponent = async () => {
      try {
        const response = await axios({
          method: 'put',
          url: `/api/users/${props.userId}/dashboard/${props.slug}/components`,
          data: {
              name: displayName,
              format: displayFormat,
              query: query
          }
        })
        if (response.status === 201) {
          handleClose()
          setDisplayName("")           
          await mutate(`/api/users/${props.userId}/dashboard/${props.slug}/components`)
          await mutate(`/api/users/${props.userId}/dashboard/${props.slug}`)
        }
      } catch (error) {
          console.log(error)
      }
    }
    
    
    return (
      <Dialog 
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-instructions"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="form-dialog-instructions">Add New Component</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{marginTop: theme.spacing(1) }}>
            <Grid item xs={12}>
                <TextField
                    autoFocus
                    name="name"
                    variant="outlined"
                    fullWidth
                    id="name"
                    label="Display Name"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="format-select-label">Display Format</InputLabel>
                <Select
                  labelId="format-select-label"
                  id="format-select"
                  value={displayFormat}
                  label="Display Format"
                  onChange={e => setDisplayFormat(e.target.value)}
                  >
                  <MenuItem value="DataGrid" key="DataGrid">Data Grid</MenuItem>
                  <MenuItem value="BarChart" key="BarChart">Bar Chart</MenuItem>
                  <MenuItem value="USMapChart" key="USMapChart">US Map Chart</MenuItem>
                  <MenuItem value="WorldMapChart" key="WorldMapChart">World Map Chart</MenuItem>
                  <MenuItem value="WeeklyCohortChart" key="WeeklyCohortChart">Weekly Cohort Chart</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={queryError}>
                <InputLabel id="query-select-label">Query</InputLabel>
                <Select
                  labelId="format-select-label"
                  id="format-select"
                  value={query}
                  label="Query"
                  onChange={e => setQuery(e.target.value)}
                >
                  {!isLoading && myQueries.Items?.map((item) => 
                (
                    <MenuItem value={item.slug} key={item.slug}>{item.name}</MenuItem>
                ))}            

                </Select>
                <FormHelperText id="query-helper-text">
                  {queryError? "You haven't created any queries yet.":""}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button 
            disabled={disable}
            onClick={() => addComponent() } 
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
    </Dialog>
    )
}

export default forwardRef(AddComponentDialog);  