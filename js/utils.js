Snake.get_random_int = function(args={})
{
    let def_args =
    {
        min: 0,
        max: 1,
        exclude: false,
        seed: Math.random
    }

    args = Object.assign(def_args, args)

    let num = Math.floor(args.seed() * (args.max - args.min + 1) + args.min)

    if(args.exclude)
    {
        let diff = args.max - args.min
        let n = num

        for(let i=0; i<diff*2; i++)
        {
            if(args.exclude.includes(n))
            {
                if(n + 1 <= args.max)
                {
                    n += 1
                }

                else
                {
                    n = args.min
                }
            }

            else
            {
                num = n
                break
            }
        }
    }

    return num
}