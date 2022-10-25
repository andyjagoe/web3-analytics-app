import { useState, useEffect } from 'react'
import {
    ListItemButton,
    ListItemText,
    Collapse,
    List
} from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { v4 as uuidv4 } from 'uuid'
  

const StructTypeListItem = (props) => {
    const [open, setOpen] = useState(true);
    const [parsedStruct, setParsedStruct] = useState([]);

    useEffect(() => {
        parseStruct()
      }, [])
    

    const parseStruct = () => {
        if (props.item.Type.includes('map<')) {
            const parsed = props.item.Type.slice(7).slice(0,-1).split(',')
            if (parsed.length === 2) return setParsedStruct([parsed.join(',')])
            return setParsedStruct(parsed)
        } else {
            const parsed = props.item.Type.slice(7).slice(0,-1).split(',')
            setParsedStruct(parsed)
        }
    }

    const handleClick = () => {
        setOpen(!open);
    }
    
    return (
    <>
        <ListItemButton sx={{ pl: 2 }} onClick={handleClick}>
            <ListItemText primary={props.item.Name} secondary="struct" />
            {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>                            
        <Collapse 
            key={`collapse${props.item.Name}`} 
            in={open} 
            timeout="auto" 
            unmountOnExit
        >
        <List component="div" disablePadding>
            {parsedStruct?.map((structItem) => 
            (
            (() => {
                const structItemParts = structItem.split(":")
                return <ListItemButton 
                            key={uuidv4()} 
                            sx={{ pl: 4 }}
                            onClick={() => 
                                {
                                    structItemParts.length > 1 ?                                    
                                    props.insertStringInTemplate(
                                        `${props.item.Name}.${structItemParts[0]}`
                                    )
                                    :
                                    props.insertStringInTemplate(
                                        `${props.item.Name}.${structItem}`
                                    )
                                }
                            }
                        >
                        {structItemParts.length > 1 ?
                        <ListItemText 
                            primary={structItemParts[0]} 
                            secondary={structItemParts[1]} 
                        />
                        :
                        <ListItemText secondary={structItem} />
                        }                                          
                    </ListItemButton>
            })()
            )
            )}
        </List>
        </Collapse>    
    </>
  ) 
}

export default StructTypeListItem
