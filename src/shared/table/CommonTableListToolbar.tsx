import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
// material
import { useTheme, styled } from '@mui/material/styles';
import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  InputAdornment,
  OutlinedInput
} from '@mui/material';
import customShadows from '../../theme/customShadows';
import { useLanguage } from '../../contexts/LanguageContext';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: customShadows().z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500]} !important`
  }
}));

// ----------------------------------------------------------------------

type CommonTableListToolbarProps = {
  numSelected: number;
  filterName: string;
  onFilterName: (value: string) => void;
};

export default function CommonTableListToolbar({
  numSelected,
  filterName,
  onFilterName
}: CommonTableListToolbarProps) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const {getLocalizationValue} = useLanguage();
  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: isLight ? 'primary.main' : 'text.primary',
          bgcolor: isLight ? 'primary.lighter' : 'primary.dark'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={(e) => onFilterName(e.target.value)}
          placeholder={getLocalizationValue('Search')+'...'}
          startAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Icon icon={trash2Fill} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Icon icon={roundFilterList} />
          </IconButton>
        </Tooltip>
      )}
    </RootStyle>
  );
}
