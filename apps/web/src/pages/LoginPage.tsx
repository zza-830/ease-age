import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Phone, Lock, User, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register, isLoading, error, clearError } = useAuthStore();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
    fullName: '',
    role: 'family' as 'elderly' | 'family' | 'staff',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.phoneNumber) {
      errors.phoneNumber = '请输入手机号';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = '请输入有效的手机号';
    }

    if (!formData.password) {
      errors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      errors.password = '密码至少6位';
    }

    if (!isLoginMode && !formData.fullName) {
      errors.fullName = '请输入姓名';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      if (isLoginMode) {
        await login(formData.phoneNumber, formData.password);
      } else {
        await register({
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          fullName: formData.fullName,
          role: formData.role,
        });
      }
      navigate('/');
    } catch (error) {
      // Error is handled by store
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500 shadow-lg mb-4">
            <span className="text-2xl font-bold text-white">E</span>
          </div>
          <h1 className="text-3xl font-bold text-stone-900">EaseAge</h1>
          <p className="text-stone-500 mt-1">颐智相伴 · 智慧养老平台</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Tabs */}
          <div className="flex mb-6 bg-stone-100 rounded-lg p-1">
            <button
              onClick={() => {
                setIsLoginMode(true);
                clearError();
                setValidationErrors({});
              }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
                isLoginMode ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              登录
            </button>
            <button
              onClick={() => {
                setIsLoginMode(false);
                clearError();
                setValidationErrors({});
              }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
                !isLoginMode ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              注册
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                手机号
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="请输入手机号"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    validationErrors.phoneNumber ? 'border-red-300' : 'border-stone-300'
                  }`}
                />
              </div>
              {validationErrors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.phoneNumber}</p>
              )}
            </div>

            {/* Full Name (Register only) */}
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  姓名
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="请输入姓名"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      validationErrors.fullName ? 'border-red-300' : 'border-stone-300'
                    }`}
                  />
                </div>
                {validationErrors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.fullName}</p>
                )}
              </div>
            )}

            {/* Role (Register only) */}
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  身份
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'family', label: '家属' },
                    { value: 'elderly', label: '老人' },
                    { value: 'staff', label: '服务人员' },
                  ].map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => handleInputChange('role', role.value)}
                      className={`py-2.5 px-4 border rounded-lg text-sm font-medium transition-colors ${
                        formData.role === role.value
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'border-stone-300 text-stone-700 hover:border-orange-300'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="请输入密码"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    validationErrors.password ? 'border-red-300' : 'border-stone-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.password}</p>
              )}
            </div>

            {/* Forgot Password (Login only) */}
            {isLoginMode && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-orange-600 hover:text-orange-700">
                  忘记密码？
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  处理中...
                </span>
              ) : (
                <span className="flex items-center">
                  {isLoginMode ? '登录' : '注册'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </button>
          </form>

        </div>

        {/* Footer */}
        <p className="text-center text-sm text-stone-500 mt-6">
          © 2026 EaseAge · 颐智相伴
        </p>
      </div>
    </div>
  );
}
