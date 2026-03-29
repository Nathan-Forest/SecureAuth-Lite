interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = (pass: string): { score: number; label: string; color: string } => {
    let score = 0;
    
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^a-zA-Z0-9]/.test(pass)) score++;
    
    if (score <= 2) return { score: 25, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score: 50, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 5) return { score: 75, label: 'Good', color: 'bg-blue-500' };
    return { score: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const strength = getStrength(password);

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-600">Password strength:</span>
        <span className="text-xs font-semibold text-gray-700">{strength.label}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${strength.score}%` }}
        ></div>
      </div>
      <div className="mt-2 text-xs text-gray-500 space-y-1">
        <p className={password.length >= 8 ? 'text-green-600' : ''}>
          {password.length >= 8 ? '✓' : '○'} At least 8 characters
        </p>
        <p className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
          {/[A-Z]/.test(password) ? '✓' : '○'} Uppercase letter
        </p>
        <p className={/[a-z]/.test(password) ? 'text-green-600' : ''}>
          {/[a-z]/.test(password) ? '✓' : '○'} Lowercase letter
        </p>
        <p className={/[0-9]/.test(password) ? 'text-green-600' : ''}>
          {/[0-9]/.test(password) ? '✓' : '○'} Number
        </p>
        <p className={/[^a-zA-Z0-9]/.test(password) ? 'text-green-600' : ''}>
          {/[^a-zA-Z0-9]/.test(password) ? '✓' : '○'} Special character
        </p>
      </div>
    </div>
  );
}