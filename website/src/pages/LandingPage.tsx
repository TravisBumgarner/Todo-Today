import { Box, Container, Typography } from '@mui/material'
import { Title } from '../components'
import { pageWrapperCSS } from '../theme'

import { styled } from '@mui/material/styles'

const TitleSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '40vh'
}))

const Section = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
  }
}))

const Image = styled('img')(({ theme }) => ({
  maxWidth: '70%',
  height: 'auto',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%'
  }
}))

const LandingPage = () => {
  return (
    <Container sx={pageWrapperCSS}>
      <TitleSection>
        <Title />
        <Typography variant="h2" sx={{ textAlign: 'center' }}>
          The todo List for the easily distracted
        </Typography>
      </TitleSection>
      {/* Queue Mode Section */}
      <Section>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Typography variant="h5">Plan Just Today</Typography>
          <Typography>
            Todo Today isn't about the past or the future, it's about right now. Focus on what matters today.
          </Typography>
          <Typography>Set your tasks, order them, and add notes or subtasks. Nothing more, nothing less.</Typography>
        </Box>
        <Image src="/public/main_page.png" alt="Main page" />
      </Section>
    </Container>
  )
}

export default LandingPage
