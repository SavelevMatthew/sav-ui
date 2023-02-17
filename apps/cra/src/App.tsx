import React, {useCallback, useState, useEffect} from 'react';
import './App.css';
import bridge from '@open-condo/bridge'
import type { ShowNotificationParams } from '@open-condo/bridge'
import { Button } from '@open-condo/ui'
import '@open-condo/ui/dist/styles.min.css'

const notificationSend = (type: ShowNotificationParams['type'], description?: string) => {
  return function () {
    bridge.send('CondoWebAppShowNotification', {
      type,
      message: 'This is message!',
      ...(description ? { description } : undefined)
    }).then(response => {
      console.log(response.success)
    })
  }
}

const clickUser = () => {
  bridge.send('CondoWebAppGetLaunchParams')
      .then(data => {
        bridge.send('CondoWebAppShowNotification', {
          type: 'info',
          message: 'Launch Params',
          description: JSON.stringify(data),
        })
      }).catch(err => {
        bridge.send('CondoWebAppShowNotification', {
          type: 'error',
          message: err.errorMessage,
          description: JSON.stringify(err)
        })
  })
}


function App() {
  const [height, setHeight] = useState(100)
  const [tasks, setTasks] = useState<Array<{ id: string, progress: number }>>([])

  const handleClick = useCallback(() => {
    setHeight(height + 100)
  }, [height])

  const handleOldSize = () => {
    // eslint-disable-next-line no-restricted-globals
    if (typeof parent !== 'undefined') {
      // eslint-disable-next-line no-restricted-globals
      parent.postMessage({ type: 'resize', height: 3000 }, '*')
    }
  }

  const handleAddTask = useCallback(() => {
    bridge.send('CondoWebAppShowProgressBar', {
      message: 'My message',
      description: 'Description',
      externalTaskId: 'my custom id'
    }).then(({ barId }) => {
      setTasks(prev => [...prev, { id: barId, progress: 0 }])
    }).catch(err => {
      bridge.send('CondoWebAppShowNotification', {
        type: "error",
        message: 'Error',
        description: JSON.stringify(err)
      })
    })

  }, [])

  const handleUpdateTask = useCallback(() => {
    if (tasks.length) {
      const lastTask = tasks[tasks.length - 1]
      const newProgress = lastTask.progress + 23
      bridge.send('CondoWebAppUpdateProgressBar', {
        barId: lastTask.id,
        data: {
          progress: newProgress,
          description: `Update to ${newProgress}`
        }
      }).then(() => {
        if (newProgress >= 100) {
          setTasks(prev => prev.slice(0, -1))
        } else {
          setTasks(prev => [...prev.slice(0, -1), { id: lastTask.id, progress: newProgress }])
        }
      })
    }
  }, [tasks])

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries && entries.length) {
        bridge.send('CondoWebAppResizeWindow', { height: entries[0].target.clientHeight })
      }
    })
    observer.observe(document.body)

    return () => observer.unobserve(document.body)
  }, [])

  const getTasks = useCallback(() => {
    bridge.send('CondoWebAppGetActiveProgressBars').then(data => {
      bridge.send('CondoWebAppShowNotification', {
        type: "info",
        message: 'Response',
        description: JSON.stringify(data)
      })
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <script src="https://unpkg.com/@open-condo/bridge/dist/browser.min.js"></script>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', gap: 20 }}>
            <Button type={'primary'}  onClick={handleClick}>
              Size
            </Button>
            <Button type={'primary'}  onClick={handleOldSize}>
              Legacy size
            </Button>
            <Button type={'primary'} onClick={() => {
              // @ts-ignore
              condoBridge.send('CondoWebAppResizeWindow', { height: 8000 })
            }}>
              Window bridge
            </Button>
          </div>
          <Button type={'primary'} onClick={clickUser}>Launch Params</Button>
          <div style={{ display: 'flex', gap: 20 }}>
            <Button type={'primary'} onClick={handleAddTask}>Register task</Button>
            <Button type={'primary'} onClick={getTasks}>Get tasks</Button>
            <Button type={'primary'} onClick={handleUpdateTask}>Update task</Button>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <Button type={'primary'} onClick={notificationSend('success')}>Success</Button>
            <Button type={'primary'} onClick={notificationSend('warning', 'This is description')}>Warning with description</Button>
            <Button type={'primary'} onClick={notificationSend('error', 'This is description')}>Error with description</Button>
            <Button type={'primary'} onClick={notificationSend('info')}>Info</Button>
          </div>
        </div>
        <div style={{ width: '5000px', height, background: '#999' }}/>
      </header>
    </div>
  );
}

export default App;
