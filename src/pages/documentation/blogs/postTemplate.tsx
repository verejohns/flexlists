import React from 'react'
import { Container, Typography, Box, Link, Divider } from '@mui/material'
import { TranslationText } from "src/models/SharedModels";
import { getTranslations, getTranslation } from "src/utils/i18n";
import MainLayout from "src/layouts/docs/MainLayout";
import Head from 'next/head';


type PostTemplateProps = {
    translations: TranslationText[];
};

export default function PostTemplate({ translations }: PostTemplateProps) {
    const t = (key: string): string => {
        if (!translations) return key;
        return getTranslation(key, translations);
    };
    return (
        <MainLayout translations={translations}>
            <Head>
                <title>{t("Page Title")}</title>
                <meta name="description" content={t("Meta Description")} />
                <meta name="keywords" content={t("Meta Keywords")} />
            </Head>
            <Box sx={{
                mt: { xs: "64px", md: "88px" },
            }}>
                <Container maxWidth='lg'>
                    <Box component={'img'} sx={{ maxWidth: { xs: "100%", md: '80%' }, margin: '0 auto' }} src={t('Post Hero Image')} />
                    <Box sx={{ mt: 4 }}>
                        <Link href={t('Post Category Link')} sx={{ textDecoration: 'none' }}>
                            <Typography variant="body1" textTransform={'uppercase'}>{t('Post Category')}</Typography>
                        </Link>
                        <Typography sx={{ my: 2 }} variant='h2'>{t('Post Title')}</Typography>
                        <Typography variant='body1'>{t('Post Date')}</Typography>
                    </Box>
                </Container>

                <Container maxWidth='md'>
                    <Typography sx={{ mt: 4, fontSize: 18 }} variant='body1'>{t('Post Content')}</Typography>
                    <Divider light sx={{ mt: 4 }} />
                    <Typography sx={{ my: 4 }} variant='body1'><span>{t('Author')} </span><Link href={t('Author Link')} sx={{ textDecoration: 'none' }}>{t('Post Author Name')}</Link> </Typography>
                </Container>
            </Box>
        </MainLayout>
    )
}
