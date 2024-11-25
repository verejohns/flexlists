import { styled } from '@mui/material/styles';
import { Card, Button, Typography, CardHeader, CardContent } from '@mui/material';
import Link from 'next/link';

const CardIconStyle = styled('img')(({ theme }) => ({
    width: 40,
    height: 40,
    margin: 'auto',
    marginTop: 20
}));

type HomeCard = {
    icon: string,
    title?: string,
    description?: string,
    button: string,
};

export default function HomeCard({ icon, title, description, button, ...other }: HomeCard) {
    return (
        <Card {...other} sx={{ margin: 'auto' }}>
            <CardIconStyle
                src={icon}
                alt={title}
            />
            <CardHeader title={title} sx={{ textAlign: 'center' }}/>

            <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{
                    color: (theme) => (theme.palette.mode === 'light' ? 'text.secondary' : 'common.white')
                }}>
                    {description}
                </Typography>
                <br />
                <Link href="/main/tour">
                    <Button
                        size="medium"
                        variant="contained"
                        sx={{ mt: 3, textAlign: 'center !important' }}
                    >
                        <Typography variant="caption">
                            {button}
                        </Typography>
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
