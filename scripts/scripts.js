import { objClock } from './objClock.js'
import { use12hFormat } from './use12hFormat.js'

const themes = {
    main: "./styles/main.css",
    jb_dark: "./styles/jb-dark.css",
    jb_light: "./styles/jb-light.css",
    dark_modern: "./styles/dark-modern.css",
    light_modern: "./styles/light-modern.css",
    one_dark_pro: "./styles/one-dark-pro.css",
    dracula_official: "./styles/dracula-official.css",
    github_theme: "./styles/github-theme.css",
    code_time: "./styles/code-time.css",
    rose_pine: "./styles/rose-pine.css",
    catppuccin_mocha: "./styles/catppuccin-mocha.css",
    synthwave_84: "./styles/synthwave-84.css",
    poison: "./styles/poison.css"
}

function Settings() {
    console.log('this', this)
    this.clock = {
        elements: {
            hour: {
                order: 0,
                visibility: true,
                type: 'number'
            },
            minute: {
                order: 1,
                visibility: true,
                type: 'number'
            },
            second: {
                order: 2,
                visibility: true,
                type: 'number'
            },
            period: {
                order: 3,
                visibility: true,
                type: 'string'
            },
            weekday: {
                order: 4,
                visibility: false,
                type: 'string'
            },
            day: {
                order: 5,
                visibility: true,
                type: 'number'
            },
            month: {
                order: 6,
                visibility: true,
                type: 'string'
            },
            year: {
                order: 7,
                visibility: true,
                type: 'number'
            },
            timezone: {
                order: 8,
                visibility: false,
                type: 'string'
            },
            unix: {
                order: 9,
                visibility: false,
                type: 'number'
            },
            utc: {
                order: 10,
                visibility: false,
                type: 'string'
            }
        },
    }

    this.format = {
        use_12h_format: false,
        show_leading_zero: false,
        use_const_declaration: true
    }

    this.visibility = {
        customization: {
            enable: false
        }
    }

    this.position = {
        customization: {
            enable: false
        },
        x: 'center',
        y: 'center'
    }

    this.theme = {
        customization: {
            enable: true
        },
        name: 'poison'
    }

    this.font = {
        size: 32,
        family: 'FiraCodeNerdFont-Retina'
    }
}

const default_settings = new Settings()

const changeable_format_elements = ['hour', 'minute', 'second', 'day']
const possible_declarations = ['let', 'const']

function addLeadingZero(num) {
    if (num < 10) return `"${num.toString().padStart(2, '0')}"`

    return `"${num}"`
}

function showLeadingZero(flag, object, elements) {
    if (flag) {
        changeable_format_elements.map((element_name) => {
            object[element_name] = addLeadingZero(object[element_name])
            if (elements[element_name].type !== 'string') {
                elements[element_name].type = 'string'
            }
        })
    } else {
        changeable_format_elements.map((element_name) => {
            if (elements[element_name].type !== 'number') {
                elements[element_name].type = 'number'
            }
        })
    }
}

function getVisibleElementsOrderedList(elements) {
    const elements_list = Object.entries(elements)

    let result = []

    for (let i = 0; i < elements_list.length; i++) {
        for (let j = 0; j < elements_list.length; j++) {
            if ((i === elements_list[j][1].order) && elements_list[j][1].visibility) {
                result.push(elements_list[j][0])
            }
        }
    }

    return result
}

function createClockElement(element_name, object, elements, comma_flag = true) {
    const element = document.createElement('p')
    element.id = element_name
    element.classList.add('tab')
    element.innerHTML = `<span class="object-key">${element_name}</span><span class="colon">:</span> <span id="${element_name}_value" class="${elements[element_name].type}">${object[element_name].toString()}</span><span class="comma">,</span>`
    if (!comma_flag) {
        element.getElementsByClassName('comma')[0].remove()
    }

    return element
}

function createClockElements(object, elements, ordered_list) {
    const last_element = ordered_list.slice(-1)[0]
    
    let result = []

    ordered_list.map((element_name) => {
        if (element_name !== last_element) {
            result.push(createClockElement(element_name, object, elements))
        } else {
            result.push(createClockElement(element_name, object, elements, false))
        }
    })

    return result
}

function createClock(object, settings) {
    const result = []

    const keyword = settings.format.use_const_declaration ? possible_declarations[1] : possible_declarations[0]
    
    const comment = document.createElement('p')
    const commentTextStr = 'comentário'
    comment.innerHTML = `<p class="comment">// ${commentTextStr}</p>`
    result.push(comment)

    const start = document.createElement('p')
    start.innerHTML = `<span class="keyword">${keyword}</span> <span class="local-variable">clock</span> <span class="operator">=</span> <span class="bracket">{</span>`
    result.push(start)

    const elements = settings.visibility.customization.enable ? settings.clock.elements : default_settings.clock.elements

    if (settings.format.use_12h_format) use12hFormat(object);

    if (object['hour'] <= 9) object['hour'] = `0${object['hour']}`

    showLeadingZero(settings.format.show_leading_zero, object, elements)
    const ordered_list = getVisibleElementsOrderedList(elements)
    const clock_elements = createClockElements(object, elements, ordered_list)
    result.push(...clock_elements)

    const end = document.createElement('p')
    end.innerHTML = `<span class="bracket">}</span><span class="semicolon">;</span>`
    result.push(end)

    return result
}

function updateClockDOM(object, settings) {
    document.getElementById('object_clock')?.replaceChildren(...createClock(object, settings))
}

function changePosition(settings) {
    const position = settings.position.customization.enable ? settings.position : default_settings.position
    const x = position.x
    const y = position.y

    document.body.style.justifyContent = x
    document.body.style.alignItems = y
}

function changeTheme(settings) {
    const theme = settings.theme
    const font = theme.customization.enable ? settings.font : default_settings.font
    document.body.style.fontFamily = font.family
    document.body.style.fontSize = font.size + "px"

    const link = document.querySelectorAll('link')[1]
    if (link.getAttribute('href') !== themes[theme.name]) {
        link.setAttribute('href', themes[theme.name])
    }
}

function updateClock(object, settings) {
    object = new objClock()

    changePosition(settings)

    changeTheme(settings)

    updateClockDOM(object, settings)
}

export {Settings, updateClock}
