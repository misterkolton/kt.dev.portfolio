import * as React from 'react'

import { CodeBlock } from '@/components/docs/code-block'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { Copy, CopyCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ComponentExampleProps {
  title?: string
  description?: string
  preview: React.ReactNode
  code: string
  language?: string
  className?: string
}

export const ComponentExample: React.FC<ComponentExampleProps> = ({
  title,
  description,
  preview,
  code,
  language,
  className,
}) => {
  const [activeTab, setActiveTab] = React.useState<'preview' | 'code'>('preview')
  const [copied, setCopied] = React.useState(false)
  const { toast } = useToast()

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
      toast({ title: 'Code copied to clipboard' })
    } catch (e) {
      // no-op
    }
  }, [code, toast])
  return (
    <Card className={cn('border-border/70 bg-card/80 backdrop-blur', className)}>
      {(title || description) && (
        <CardHeader className="border-b border-border/60">
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'preview' | 'code')} className="w-full">
          <div className="flex items-center justify-between border-b border-border/60 px-4 pt-4">
            <TabsList className="bg-transparent p-0">
              <TabsTrigger value="preview" className="rounded-none border-b-2 border-transparent px-3 py-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground">
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="rounded-none border-b-2 border-transparent px-3 py-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground">
                Code
              </TabsTrigger>
            </TabsList>
            {activeTab === 'code' ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                aria-label={copied ? 'Copied' : 'Copy code'}
              >
                {copied ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            ) : (
              <div className="h-8" />
            )}
          </div>
          <TabsContent value="preview" className="p-6">
            <div className="rounded-lg border border-dashed border-border/60 bg-background/60 p-6">
              {preview}
            </div>
          </TabsContent>
          <TabsContent value="code" className="p-6">
            <ScrollArea className="max-h-[420px]">
              <CodeBlock code={code.trim()} language={language} />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
