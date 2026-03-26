import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-[#141416] border border-white/[0.08] shadow-xl shadow-black/40',
            headerTitle: 'text-white',
            headerSubtitle: 'text-stone-400',
            formFieldLabel: 'text-stone-300',
            formFieldInput:
              'bg-white/[0.05] border-white/[0.1] text-white placeholder-stone-600 focus:border-indigo-500/60',
            formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white',
            footerActionLink: 'text-indigo-400 hover:text-indigo-300',
          },
        }}
      />
    </div>
  );
}
