'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestApiPage() {
  const [testResult, setTestResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const testConnection = async () => {
    setIsLoading(true)
    setError('')
    setTestResult('')
    
    try {
      const response = await axios.get('http://localhost:4000/test-db')
      setTestResult(JSON.stringify(response.data, null, 2))
    } catch (err) {
      console.error('Error testing API:', err)
      setError('Failed to connect to API. Check server logs.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>API Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testConnection} 
            disabled={isLoading}
          >
            {isLoading ? 'Testing...' : 'Test API Connection'}
          </Button>
          
          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {testResult && (
            <div className="p-4 bg-green-100 text-green-700 rounded-md">
              <pre>{testResult}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 