import { useNavigate } from 'react-router-dom'
import { ArrowRightLeft, Info } from 'lucide-react'
import { useConverter, CONVERSION_TYPES } from '../hooks/useConverter'
import DropZone from '../components/converter/DropZone'
import FilePreviewCard from '../components/converter/FilePreviewCard'
import ConversionTypeSelector from '../components/converter/ConversionTypeSelector'
import ProgressBar from '../components/converter/ProgressBar'
import ConversionResult from '../components/converter/ConversionResult'
import Spinner from '../components/common/Spinner'

export default function ConvertPage() {
  const navigate = useNavigate()
  const {
    file,
    conversionType,
    setConversionType,
    status,
    progress,
    resultFilename,
    error,
    selectFile,
    reset,
    convert,
    supportedConversions,
    isSupported,
    isLoading,
  } = useConverter()

  const showResult = status === 'done' || status === 'error'
  const showProgress = status === 'uploading' || status === 'converting'

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-header__eyebrow">Tools</div>
        <h1 className="page-header__title">
          Convert <span>Files</span>
        </h1>
        <p className="page-header__description">
          Transform your documents between PDF, Word, and text formats.
          Select a file and choose your target format to get started.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--sp-6)', alignItems: 'start' }}>

        {/* Main converter card */}
        <div className="card" style={{ animation: 'fadeInUp 0.45s var(--ease-out) both' }}>
          <div className="card-header">
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 4 }}>
                File Converter
              </h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', margin: 0 }}>
                Upload a file and select conversion type
              </p>
            </div>
            <ArrowRightLeft size={20} style={{ color: 'var(--accent-primary)' }} />
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>

            {showResult ? (
              <ConversionResult
                status={status}
                resultFilename={resultFilename}
                error={error}
                onReset={reset}
              />
            ) : (
              <>
                {/* Drop zone */}
                {!file ? (
                  <DropZone onFile={selectFile} disabled={isLoading} />
                ) : (
                  <FilePreviewCard file={file} onRemove={reset} />
                )}

                {/* Conversion type selector */}
                {file && (
                  <ConversionTypeSelector
                    value={conversionType}
                    onChange={setConversionType}
                    supportedConversions={supportedConversions}
                  />
                )}

                {/* File not supported warning */}
                {file && !isSupported && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--sp-3)',
                    padding: 'var(--sp-4)',
                    background: 'var(--warning-bg)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--warning)',
                    fontSize: 'var(--text-sm)',
                  }}>
                    <Info size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>
                      This file type is not supported for conversion. 
                      Supported: <strong>.txt</strong>, <strong>.docx</strong>, <strong>.doc</strong>, <strong>.pdf</strong>
                    </span>
                  </div>
                )}

                {/* Progress */}
                {showProgress && (
                  <ProgressBar progress={progress} status={status} />
                )}

                {/* Convert button */}
                {file && isSupported && !showProgress && (
                  <button
                    className={`btn btn--primary btn--lg ${isLoading ? 'btn--loading' : ''}`}
                    onClick={convert}
                    disabled={isLoading}
                    style={{ width: '100%' }}
                  >
                    {isLoading ? <Spinner /> : <ArrowRightLeft size={18} />}
                    {isLoading ? 'Converting…' : `Convert to ${conversionType === 'to-pdf' ? 'PDF' : 'Word'}`}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Info sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)', animation: 'fadeInUp 0.45s var(--ease-out) 0.1s both' }}>

          {/* Supported conversions */}
          <div className="card card--accent">
            <div className="card-body">
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--sp-4)', color: 'var(--text-primary)' }}>
                Supported Conversions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                {[
                  { from: 'TXT', to: 'PDF', fromClass: 'txt', toClass: 'pdf' },
                  { from: 'TXT', to: 'DOCX', fromClass: 'txt', toClass: 'docx' },
                  { from: 'DOCX', to: 'PDF', fromClass: 'docx', toClass: 'pdf' },
                  { from: 'DOC', to: 'PDF', fromClass: 'doc', toClass: 'pdf' },
                  { from: 'PDF', to: 'DOCX', fromClass: 'pdf', toClass: 'docx' },
                ].map(({ from, to, fromClass, toClass }) => (
                  <div key={`${from}-${to}`} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sp-2)',
                    fontSize: 'var(--text-xs)',
                  }}>
                    <span className={`badge badge--${fromClass}`}>{from}</span>
                    <ArrowRightLeft size={12} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                    <span className={`badge badge--${toClass}`}>{to}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--sp-3)', color: 'var(--text-primary)' }}>
                Tips
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                {[
                  'Max file size is 50 MB',
                  'For best PDF quality, use .docx instead of .doc',
                  'PDF → Word works best on text-based PDFs',
                  'Converted files download automatically',
                ].map((tip, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--sp-2)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>→</span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
