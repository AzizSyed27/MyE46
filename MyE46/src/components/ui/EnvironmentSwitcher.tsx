import { useBuildStore } from '../../store/buildStore'
import { ENVIRONMENT_LIST } from '../../data/environments'
import './EnvironmentSwitcher.css'

export default function EnvironmentSwitcher() {
  const environment = useBuildStore((s) => s.environment)
  const setEnvironment = useBuildStore((s) => s.setEnvironment)

  return (
    <div className="env-switcher">
      {ENVIRONMENT_LIST.map((env) => (
        <button
          key={env.id}
          className={`env-switcher-btn ${environment === env.id ? 'env-switcher-btn--active' : ''}`}
          onClick={() => setEnvironment(env.id)}
          title={env.description}
        >
          <span
            className="env-switcher-dot"
            style={{ backgroundColor: env.backgroundColor }}
          />
          <span className="env-switcher-label">{env.name}</span>
        </button>
      ))}
    </div>
  )
}