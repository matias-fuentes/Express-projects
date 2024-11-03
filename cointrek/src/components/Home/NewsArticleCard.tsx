import React from 'react';
import './NewsArticleCard.css';
import { Card, CardActions, CardContent, Button, Typography } from '@mui/material';
import { NewsArticle } from '../../global.models';

interface Props {
    article: NewsArticle;
}

export const NewsArticleCard: React.FC<Props> = ({ article }) => {
    const { title, description, link, pubDate } = article;
    return (
        <Card className='animate__animated animate__zoomIn col-span-1 p-3 d-flex flex-column articleCard'>
            <CardContent sx={{ overflow: 'scroll', padding: '8px' }} className='overflow-hidden flex-grow-1'>
                <Typography
                    gutterBottom
                    variant='body1'
                    component='div'
                    className='articleTitle'
                    onClick={() => window.open(`${link}`, '_blank')}
                >
                    {title}
                </Typography>
                <Typography variant='body2' className='text-secondary'>
                    {description}
                </Typography>
            </CardContent>

            <CardActions sx={{ padding: '0 10px' }}>
                <Button size='small' onClick={() => window.open(`${link}`, '_blank')}>
                    Read full article
                </Button>
                <Typography className='text-secondary' sx={{ fontSize: '12px', marginLeft: 'auto' }}>
                    {new Date(pubDate).toDateString()}
                </Typography>
            </CardActions>
        </Card>
    );
};
