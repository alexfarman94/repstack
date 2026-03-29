import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-white border border-slate-200 shadow-xl shadow-black/5 rounded-2xl',
            headerTitle: 'text-slate-900',
            headerSubtitle: 'text-slate-500',
            formFieldLabel: 'text-slate-700',
            formFieldInput:
              'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20',
            formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
            footerActionLink: 'text-indigo-600 hover:text-indigo-700',
          },
        }}
      />
    </div>
  );
}
