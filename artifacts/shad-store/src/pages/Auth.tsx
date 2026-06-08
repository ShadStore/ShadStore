import { useState } from 'react'
import { useLocation } from 'wouter'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { toast } from '@/hooks/use-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, Store } from 'lucide-react'

const loginSchema = z.object({ username: z.string().min(1), password: z.string().min(1) })
const registerSchema = z.object({ username: z.string().min(3), password: z.string().min(4), fullName: z.string().min(1), phone: z.string().optional() })

export default function AuthPage() {
  const [, setLocation] = useLocation()
  const qc = useQueryClient()
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [regForm, setRegForm] = useState({ username: '', password: '', fullName: '', phone: '' })

  const meQ = useQuery({ queryKey: ['website-me'], queryFn: () => fetch('/api/website/me', { credentials: 'include' }).then(r => r.json()) })
  if (meQ.data) { setLocation('/'); return null }

  const loginMut = useMutation({
    mutationFn: () => fetch('/api/website/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginForm), credentials: 'include' }).then(r => r.json() as Promise<{ success?: boolean; error?: string }>),
    onSuccess: (d) => {
      if (d.error) { toast({ title: 'خطأ', description: d.error, variant: 'destructive' }); return }
      qc.invalidateQueries({ queryKey: ['website-me'] })
      setLocation('/')
    }
  })
  const regMut = useMutation({
    mutationFn: () => fetch('/api/website/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(regForm), credentials: 'include' }).then(r => r.json() as Promise<{ success?: boolean; error?: string }>),
    onSuccess: (d) => {
      if (d.error) { toast({ title: 'خطأ', description: d.error, variant: 'destructive' }); return }
      toast({ title: 'تم إنشاء الحساب بنجاح', description: 'يمكنك تسجيل الدخول الآن' })
    }
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    loginMut.mutate()
  }
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (!registerSchema.safeParse(regForm).success) { toast({ title: 'خطأ', description: 'تأكد من صحة البيانات', variant: 'destructive' }); return }
    regMut.mutate()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--shad-bg-color)', direction: 'rtl' }}>
      <Card className="w-full max-w-md" style={{ background: 'var(--shad-card-bg)', borderColor: 'rgba(255,255,255,0.1)' }}>
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-2xl" style={{ background: 'var(--shad-brand-muted)' }}>
              <Store className="h-8 w-8" style={{ color: 'var(--shad-brand)' }} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold" style={{ color: 'var(--shad-brand)' }}>ShadStore</CardTitle>
          <CardDescription style={{ color: 'rgba(255,255,255,0.6)' }}>تسجيل الدخول أو إنشاء حساب جديد</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" dir="rtl">
            <TabsList className="grid w-full grid-cols-2 mb-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <TabsTrigger value="login" style={({ active }: any) => ({ color: active ? 'var(--shad-brand)' : 'rgba(255,255,255,0.6)' })}>تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="register" style={({ active }: any) => ({ color: active ? 'var(--shad-brand)' : 'rgba(255,255,255,0.6)' })}>إنشاء حساب</TabsTrigger>
            </TabsList>
            <TabsContent value="login" dir="rtl">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2"><Label style={{ color: 'rgba(255,255,255,0.8)' }}>اسم المستخدم</Label><Input value={loginForm.username} onChange={e => setLoginForm({ ...loginForm, username: e.target.value })} placeholder="أدخل اسم المستخدم" dir="rtl" /></div>
                <div className="space-y-2"><Label style={{ color: 'rgba(255,255,255,0.8)' }}>كلمة المرور</Label><Input type="password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="أدخل كلمة المرور" dir="rtl" /></div>
                <Button type="submit" className="w-full" disabled={loginMut.isPending} style={{ background: 'var(--shad-brand)', color: '#000', fontWeight: 700 }}>
                  {loginMut.isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}تسجيل الدخول</Button>
              </form>
            </TabsContent>
            <TabsContent value="register" dir="rtl">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2"><Label style={{ color: 'rgba(255,255,255,0.8)' }}>الاسم الكامل</Label><Input value={regForm.fullName} onChange={e => setRegForm({ ...regForm, fullName: e.target.value })} placeholder="الاسم الكامل" required dir="rtl" /></div>
                <div className="space-y-2"><Label style={{ color: 'rgba(255,255,255,0.8)' }}>اسم المستخدم</Label><Input value={regForm.username} onChange={e => setRegForm({ ...regForm, username: e.target.value })} placeholder="اسم المستخدم" required dir="rtl" /></div>
                <div className="space-y-2"><Label style={{ color: 'rgba(255,255,255,0.8)' }}>رقم الهاتف</Label><Input value={regForm.phone} onChange={e => setRegForm({ ...regForm, phone: e.target.value })} placeholder="رقم الهاتف (اختياري)" dir="rtl" /></div>
                <div className="space-y-2"><Label style={{ color: 'rgba(255,255,255,0.8)' }}>كلمة المرور</Label><Input type="password" value={regForm.password} onChange={e => setRegForm({ ...regForm, password: e.target.value })} placeholder="4 أحرف على الأقل" required dir="rtl" /></div>
                <Button type="submit" className="w-full" disabled={regMut.isPending} style={{ background: 'var(--shad-brand)', color: '#000', fontWeight: 700 }}>
                  {regMut.isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}إنشاء حساب</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}