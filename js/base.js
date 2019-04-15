const Snake = {}

Snake.init = function()
{
    Snake.start_key_detection()
    Snake.start_cursor_events()
    Snake.start_game()
}

Snake.start_game = function()
{
    Snake.init_variables()
    Snake.create_grid()
    Snake.create_snake()
    Snake.place_fruit()
    Snake.start_snake_movement()
    Snake.hide_mouse_cursor()
    Snake.game_started = true
}

Snake.init_variables = function()
{
    Snake.block_size = 30
    Snake.horizontal_blocks = 30
    Snake.vertical_blocks = 20
    Snake.grid = []
    Snake.snake_blocks = []
    Snake.game_paused = false
    Snake.music_started = false
    Snake.fruit_block = false
    Snake.fruit_counter = 0
    Snake.score = 0
    $("#title").text("S N E K")
}

Snake.create_grid = function()
{
    $("#game").html("")

    let left = 0
    let top = 0

    for(let y=0; y<Snake.vertical_blocks; y++)
    {
        for(let x=0; x<Snake.horizontal_blocks; x++)
        {
            let block = $("<div class='block'></div>")
            block.css("left", `${left}px`)
            block.css("top", `${top}px`)
            block.width(`${Snake.block_size}px`)
            block.height(`${Snake.block_size}px`)
            $("#game").append(block)
            
            left += Snake.block_size
            
            if(!Snake.grid[y])
            {
                Snake.grid[y] = []
            }

            Snake.grid[y].push({used:false, fruit:false, block:block[0]})
        }

        top += Snake.block_size
        left = 0
    }

    $("#game").width(`${Snake.block_size * Snake.horizontal_blocks}px`)
    $("#game").height(`${Snake.block_size * Snake.vertical_blocks}px`)
}

Snake.create_snake = function()
{
    let y = Snake.get_random_int({min:0, max:Snake.vertical_blocks - 1})
    let x = Snake.get_random_int({min:0, max:Snake.horizontal_blocks - 1})
    
    Snake.snake_blocks.push([y, x])

    Snake.snake_direction = ""

    if(x <= Snake.horizontal_blocks / 2)
    {
        Snake.snake_direction = "right"
    }

    else
    {
        Snake.snake_direction = "left"
    }

    Snake.grid[y][x].used = true
    let snake_block = $(Snake.grid[y][x].block)
    snake_block.addClass("snake_block")
}

Snake.start_snake_movement = function()
{
    Snake.snake_movement_timeout = setTimeout(function()
    {
        Snake.move_snake()
    }, 200)
}

Snake.move_snake = function()
{
    let head = Snake.snake_blocks.slice(-1)[0]
    let y = head[0]
    let x = head[1]
    let new_y, new_x
    let move = true

    if(Snake.snake_direction === "up")
    {
        new_y = y - 1
        new_x = x

        if(new_y < 0 || Snake.grid[new_y][new_x].used)
        {
            move = false
        }
    }

    else if(Snake.snake_direction === "down")
    {
        new_y = y + 1
        new_x = x

        if(new_y >= Snake.vertical_blocks || Snake.grid[new_y][new_x].used)
        {
            move = false
        }
    }

    else if(Snake.snake_direction === "left")
    {
        new_y = y
        new_x = x - 1

        if(new_x < 0 || Snake.grid[new_y][new_x].used)
        {
            move = false
        }
    }

    else if(Snake.snake_direction === "right")
    {
        new_y = y
        new_x = x + 1

        if(new_x >= Snake.horizontal_blocks || Snake.grid[new_y][new_x].used)
        {
            move = false
        }
    }

    if(!move)
    {
        Snake.game_over()
        return false
    }

    let got_fruit = false

    if(Snake.grid[new_y][new_x].fruit)
    {
        got_fruit = true
    }
    
    else
    {
        if(Snake.fruit_counter === 0)
        {
            let block = Snake.snake_blocks.shift()
            let y = block[0]
            let x = block[1]
            Snake.grid[y][x].used = false
            $(Snake.grid[y][x].block).removeClass("snake_block")
        }

        else
        {
            Snake.fruit_counter -= 1
        }
    }
    
    Snake.snake_blocks.push([new_y, new_x])
    Snake.grid[new_y][new_x].used = true
    $(Snake.grid[new_y][new_x].block).addClass("snake_block")

    if(got_fruit)
    {
        Snake.score += 1
        Snake.fruit_counter += 3
        Snake.place_fruit()
        Snake.play_sound("fruit")
        Snake.update_title()
    }

    Snake.start_snake_movement()
}

Snake.place_fruit = function()
{
    if(Snake.fruit_block)
    {
        $(Snake.fruit_block.block).removeClass("fruit")
        $(Snake.fruit_block.block).addClass("snake_block")
        Snake.fruit_block.fruit = false
    }

    let available = []

    for(let row of Snake.grid)
    {
        for(let item of row)
        {
            if(!item.used)
            {
                available.push(item)
            }
        }
    }

    let block = available[Snake.get_random_int({min:0, max:available.length - 1})]
    block.fruit = true
    $(block.block).addClass("fruit")
    Snake.fruit_block = block
}

Snake.start_key_detection = function()
{
    document.addEventListener('keydown', (e) =>
    {
        if(!Snake.music_started)
        {
            Snake.start_music()
        }

        if(!Snake.game_started)
        {
            if(e.key === "Enter" || e.key.startsWith("Arrow"))
            {
                Snake.start_game()
                e.preventDefault()
                return false
            }
        }

        if(!e.repeat)
        {
            if(e.key === "Escape")
            {
                Snake.toggle_pause()
                move = false
                e.preventDefault()
                return false
            }

            if(Snake.game_paused)
            {
                return false
            }

            move = true

            if(e.key === "ArrowUp")
            {
                if(Snake.snake_direction === "down" || Snake.snake_direction === "up")
                {
                    move = false
                }

                else
                {
                    Snake.snake_direction = "up"
                }
            }

            else if(e.key === "ArrowDown")
            {
                if(Snake.snake_direction === "up" || Snake.snake_direction === "down")
                {
                    move = false
                }

                else
                {
                    Snake.snake_direction = "down"
                }
            }

            else if(e.key === "ArrowLeft")
            {
                if(Snake.snake_direction === "right" || Snake.snake_direction === "left")
                {
                    move = false
                }

                else
                {
                    Snake.snake_direction = "left"
                }
            }

            else if(e.key === "ArrowRight")
            {
                if(Snake.snake_direction === "left" || Snake.snake_direction === "right")
                {
                    move = false
                }

                else
                {
                    Snake.snake_direction = "right"
                }
            }

            else
            {
                move = false
            }

            if(move)
            {
                clearTimeout(Snake.snake_movement_timeout)
                Snake.move_snake()
                e.preventDefault()
                return false
            }
        }
    })
}

Snake.game_over = function()
{
    $("#sound_music")[0].pause()
    clearTimeout(Snake.snake_movement_timeout)
    alert(`Score: ${Snake.score}`)
    Snake.game_started = false
}

Snake.toggle_pause = function()
{
    if(Snake.game_paused)
    {
        Snake.unpause_game()
    }

    else
    {
        Snake.pause_game()
    }
}

Snake.pause_game = function()
{
    clearTimeout(Snake.snake_movement_timeout)
    $("#sound_music")[0].pause()
    Snake.game_paused = true
}

Snake.unpause_game = function()
{
    Snake.start_snake_movement()
    $("#sound_music")[0].play()
    Snake.game_paused = false
}

Snake.start_music = function()
{
    $("#sound_music")[0].volume = 0.25
    $("#sound_music")[0].loop = true
    Snake.play_sound("music")
    Snake.music_started = true
}

Snake.play_sound = function(name)
{
    $(`#sound_${name}`)[0].pause()
    $(`#sound_${name}`)[0].currentTime = 0
    $(`#sound_${name}`)[0].play()
}

Snake.start_cursor_events = function()
{
    window.onmousemove = function()
    {
        Snake.show_mouse_cursor()
        Snake.start_hide_mouse_cursor_timeout()
    }
}

Snake.show_mouse_cursor = function()
{
    clearTimeout(Snake.hide_cursor_timeout)
    $("body").removeClass("no_cursor")
}

Snake.hide_mouse_cursor = function()
{
    $("body").addClass("no_cursor")
}

Snake.start_hide_mouse_cursor_timeout = function()
{
    Snake.hide_cursor_timeout = setTimeout(function()
    {
        Snake.hide_mouse_cursor()
    }, 1000)
}

Snake.update_title = function()
{
    $("#title").text(Snake.score)
}