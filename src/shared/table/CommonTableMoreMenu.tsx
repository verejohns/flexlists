import { Icon } from '@iconify/react';
import { paramCase } from 'change-case';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';

// ----------------------------------------------------------------------

type CommonTableMoreMenuProps = {
  onDelete: VoidFunction;
  onEdit: VoidFunction;
  onOtherFunctions? : {name :string,function :VoidFunction}[];
  editPermissionEnable?: boolean;
  deletePermissionEnable? : boolean ;
};

export default function CommonMoreMenu({ onDelete,onEdit,editPermissionEnable,deletePermissionEnable,onOtherFunctions }: CommonTableMoreMenuProps) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const {getLocalizationValue} = useLanguage();
  const handleDelete = ()=>
  {
      setIsOpen(false);
      onDelete();
  }
  const handleEdit = ()=>
  {
      setIsOpen(false);
      onEdit();
  }
    
  return (
    <>
    <IconButton ref={ref} onClick={() => setIsOpen(true)}>
      <Icon icon={moreVerticalFill} width={20} height={20} />
    </IconButton>

    <Menu
      open={isOpen}
      anchorEl={ref.current}
      onClose={() => setIsOpen(false)}
      PaperProps={{
        sx: { width: 200, maxWidth: '100%' }
      }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
     
      {(deletePermissionEnable == undefined || deletePermissionEnable == true) &&
      <MenuItem onClick={()=>handleDelete()} sx={{ color: 'text.secondary' }}>
        <ListItemIcon>
          <Icon icon={trash2Outline} width={24} height={24} />
        </ListItemIcon>
        <ListItemText primary={getLocalizationValue('Delete')} primaryTypographyProps={{ variant: 'body2' }} />
      </MenuItem>
      }
    {
      (editPermissionEnable == undefined || editPermissionEnable == true) && 
        <MenuItem
        onClick={()=>handleEdit()}
        sx={{ color: 'text.secondary' }}
      >
        <ListItemIcon>
          <Icon icon={editFill} width={24} height={24} />
        </ListItemIcon>
        <ListItemText primary={getLocalizationValue('Edit')} primaryTypographyProps={{ variant: 'body2' }} />
      
      </MenuItem>
    }
    {
       (onOtherFunctions && onOtherFunctions.length > 0) &&
       (
        onOtherFunctions.map((otherFunction,index)=>{
           return (<MenuItem
           key={index}
            onClick={()=>{setIsOpen(false);otherFunction.function()}}
            sx={{ color: 'text.secondary' }}
          >
            <ListItemIcon>
              <Icon icon={editFill} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary={getLocalizationValue(otherFunction.name)} primaryTypographyProps={{ variant: 'body2' }} />
          
          </MenuItem>)
        })
       )
    }
    </Menu>
  </>
    
  );
}
