import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Blog from './pages/Blog'
import PostDetail from './pages/PostDetail'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import LessonDetail from './pages/LessonDetail'
import Login from './pages/Login'
import AdminPosts from './pages/AdminPosts'
import AdminPostEditor from './pages/AdminPostEditor'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<PostDetail />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />
            <Route path="/courses/:courseSlug/lessons/:lessonSlug" element={<LessonDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminPosts />} />
            <Route path="/admin/posts/:id" element={<AdminPostEditor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
