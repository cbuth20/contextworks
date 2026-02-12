import { CheckCircle } from 'lucide-react'

export function SignedConfirmation({ signerName }: { signerName?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <CheckCircle className="h-16 w-16 mx-auto text-foreground mb-6" />
        <h1 className="text-2xl font-bold tracking-tight mb-2">Document Signed</h1>
        <p className="text-muted-foreground">
          {signerName ? `Thank you, ${signerName}.` : 'Thank you.'} Your signature has been recorded successfully.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          You can safely close this page. The document owner will be notified.
        </p>
        <div className="mt-8 pt-6 border-t">
          <span className="text-sm text-muted-foreground">
            Powered by <span className="font-medium text-foreground">ContextWorks</span>
          </span>
        </div>
      </div>
    </div>
  )
}
