import { useScreenRecorder } from './hooks/useScreenRecorder'
import { ccc } from './utils'

const ScreenRecorder = (props) => {
    const { options = {} } = props
    const {
        isRecording,
        startRecording,
        stopRecording,
        getScreenRecording
    } = useScreenRecorder(options)

    const buttonTitle = (isRecording ? 'Stop' : 'Start') + ' Recording'
    const glyph = isRecording ? '⏹' : '⏵';

    const handleClick = (e) => {
        e.preventDefault()
        const handler = isRecording ? stopRecording : startRecording;
        handler()
    }

    return (
        <>
            <button
                title={buttonTitle}
                onClick={(e) => handleClick(e)}
                className={ccc(
                    'ScreenRecorderButton',
                    isRecording && 'isRecording'
                )}
            >
                <i aria-hidden="true">{glyph}</i>
            </button>
        </>
    )
}

export default ScreenRecorder
