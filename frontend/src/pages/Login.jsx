import { Fragment } from 'react'
import { Form, Link, redirect, useNavigation } from 'react-router-dom'

import PropTypes from 'prop-types'
import {
  Button,
  Typography,
  Container,
  Paper,
  Divider,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import { FormRow } from '../components'
import customFetch from '../utils/customFetch'
import { toast } from 'react-toastify'
import '../assets/css/login.css'

export const action = async ({ request }) => {
  const formData = await request.formData()
  const dataForm = Object.fromEntries(formData)
  const rememberMe = dataForm.rememberMe
  try {
    const { data } = await customFetch.post('/auth/login', dataForm, {})

    toast.success('Ви увійшли успішно успішно')
    return redirect(`/profile`)
    // return response;
  } catch (error) {
    console.log('🚀 ~ action ~ error:', error)
    toast.error(error?.response.data?.msg)
    return error
  }
}
const Login = () => {
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`)
    // Here you would implement OAuth login with the selected provider
  }
  return (
    <Fragment>
      <div className="hero">
        <Container>
          <Typography variant="h3" gutterBottom>
            Вхід до платформи
          </Typography>
          <Typography variant="h6">
            Увійдіть у свій аккаунт для доступу до всіх можливостей
          </Typography>
        </Container>
      </div>

      <Container>
        <Paper className="login-form" elevation={3}>
          <div style={{ marginBottom: '20px' }}>
            <Button
              variant="contained"
              fullWidth
              style={{
                marginBottom: '10px',
                backgroundColor: '#DB4437',
                color: 'white',
              }}
              onClick={() => handleSocialLogin('google')}
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google icon"
                style={{ width: '20px', height: '20px', marginRight: '10px' }}
              />
              Увійти через Google
            </Button>
            <Button
              variant="contained"
              fullWidth
              style={{
                marginBottom: '10px',
                backgroundColor: '#4267B2',
                color: 'white',
              }}
              onClick={() => handleSocialLogin('facebook')}
            >
              <img
                src="https://www.facebook.com/favicon.ico"
                alt="Facebook icon"
                style={{ width: '20px', height: '20px', marginRight: '10px' }}
              />
              Увійти через Facebook
            </Button>
            <Button
              variant="contained"
              fullWidth
              style={{
                marginBottom: '10px',
                backgroundColor: '#1DA1F2',
                color: 'white',
              }}
              onClick={() => handleSocialLogin('twitter')}
            >
              <img
                src="https://twitter.com/favicon.ico"
                alt="Twitter icon"
                style={{ width: '20px', height: '20px', marginRight: '10px' }}
              />
              Увійти через Twitter
            </Button>
          </div>

          <Divider style={{ margin: '20px 0' }}>
            <Typography variant="body2" color="textSecondary">
              або
            </Typography>
          </Divider>

          <Form method="post">
            <div className="form-field">
              <FormRow label="Email" name="email" type="email" />
            </div>
            <div className="form-field">
              <FormRow type="password" label="Пароль" name="password" />
            </div>
            <div className="form-field">
              <FormControlLabel
                control={<Checkbox name="rememberMe" />}
                label="Запам'ятати мене"
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Зєднання...' : 'Увійти'}
            </Button>
            <Typography
              variant="body2"
              style={{ marginTop: '20px', textAlign: 'center' }}
            >
              Забули пароль?{' '}
              <Button color="primary" component={Link} to="#">
                Відновити
              </Button>
            </Typography>
            <Typography
              variant="body2"
              style={{ marginTop: '10px', textAlign: 'center' }}
            >
              Немає аккаунту?{' '}
              <Button color="primary" component={Link} to="/register">
                Зареєструватися
              </Button>
            </Typography>
          </Form>
        </Paper>
      </Container>
    </Fragment>
  )
}
Login.propTypes = {}
export default Login
