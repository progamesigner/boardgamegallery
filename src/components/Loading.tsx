import type { JSX } from 'solid-js'

export function Loading(): JSX.Element {
  return (
    <div class="card my-auto">
      <div class="card-body flex h-96 max-h-screen justify-center">
        <div class="flex flex-col items-center">
          <button class="loading btn-square btn" />
          <p>載入中</p>
        </div>
      </div>
    </div>
  )
}
