import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts"
import { useEffect, useRef, useState } from "react";

const DescriptionToTags = () => {

    const [tags, setTags] = useState([])
    const textRef = useRef()
    const possibleTagsList = [
        "Alarm System",
        "Broadband",
        "Built in Robes",
        "Dishwasher",
        "Ensuite",
        "Fireplace",
        "Floor Boards",
        "Gym",
        "Heating Other",
        "Hot Water Gas",
        "Hot Water Electric",
        "Hot Water Solar",
        "Intercom",
        "Pay TV",
        "Rumpus Room",
        "Spa",
        "Study",
        "Vacuum System",
        "Workshop",
        "Balcony",
        "Courtyard",
        "Deck",
        "Fully Fenced",
        "Outdoor Entertainment",
        "Pool(Above Ground)",
        "Pool(Inground)",
        "Remote Garage",
        "Secure Parking",
        "Shed",
        "Tennis Court",
        "Air Conditioning",
        "Ducted Cooling",
        "Ducted Heating",
        "Evaporative Cooling",
        "Heating Gas",
        "Heating Electric",
        "Heating Hydronic",
        "Reverse Cycle Air Con",
        "Split System(Heating)",
        "Split System(Air Con)",
        "Solar Panels",
        "Water Tank"
    ]
    useEffect(
        () => {
            textRef.current.value = `
            8 Caesar Place for Sale
            This exceptional custom-designed home is a rare gem, showcasing quality and liveability in every corner. Nestled in a quiet cul-de-sac within the prestigious Laurina Precinct of Harrington Grove, you are welcomed with its spacious proportions, soaring high ceilings, and versatility that will allow your imagination to run wild.
            Step outside into your personal family oasis, where you can savour your morning coffee in serenity or gather with loved ones in the expansive alfresco area, complete with all the modern amenities and comforts you desire. Plenty of room for a pool (STCA) for the family as well as side access opportunities.
            Fitted with a separate access in-law / teenager accommodation, encompassing a self-contained kitchenette, bedroom, a full bathroom welcoming multi-generation living, a teenage retreat or a potential "man / woman cave" - you will be the envy of your friends!

            Highlight Features:

            - 5 Bed plus Study, walk in wardrobe and ensuite to the master bedroom
            - Media Room
            - In-law Accommodation
            - Irrigation System for front and back lawns
            - Alarm System
            - Multizone Actron Air Ducted air conditioning
            - High ceilings
            - 900mm Smeg Cooktop
            - Bosch Dishwasher
            - Under stairs storage

            Lifestyle Features:

            - Close proximity to the highly sought after Macarthur Anglican College
            - Access to the Harrington Grove facilities (GYM, Pool, Tennis Courts, Function Rooms, Security Patrolled area)
            - Close to the Narellan Town Centre and a host of culinary options

            A rare opportunity suiting a variety of buyers / families with its versatile layout, and in a highly prized location, contact our team to express your interest on 4647 9727.

            *Century 21 Pereira Group believes all information contained herein is accurate at the time of advertising. However, we encourage interested parties to conduct their own enquiries.

            ******** COVID-19 Statement for all inspecting parties ********

            I acknowledge that in doing my part to stop the spread of Covid-19, I will not attend any open homes conducted by Century 21 Pereira Group, whether they be Sales Open Homes or Rental Open Homes if I am experiencing flu like symptoms, I have tested positive for Covid-19 or have been in close contact with another party diagnosed with Covid-19. I also acknowledge that I will adhere to the Covid-19 safety measures put in place by Century 21 Pereira Group and will adhere to these guidelines as instructed by the Agent conducting the open home.
            `
        }, []
    )

    const chatModel = new ChatOpenAI({
        openAIApiKey: import.meta.env.VITE_OPENAI_KEY,
        temperature: 0.0
    })

    const getAnswer = async (e) => {
        setTags([])
        e.preventDefault()
        const description = e.target.elements.description.value
        const template = `
        Description: "{description}"

        Tags List:  {tagsList}

        For the above given description of a real estate property and the desired tags list, \
        you need to extract appropriate tags that matches to the tags list given above. \
        You need to find tags in such a way that those feature belong to the property \
        and the extracted tags must be from the tags list only. Your output should in \
        the form of array.
        `

        const tagsList = `
        - Alarm System
        - Broadband
        - Built in Robes
        - Dishwasher
        - Ensuite
        - Fireplace
        - Floor Boards
        - Gym
        - Heating Other
        - Hot Water Gas
        - Hot Water Electric
        - Hot Water Solar
        - Intercom
        - Pay TV
        - Rumpus Room
        - Spa
        - Study
        - Vacuum System
        - Workshop
        - Balcony
        - Courtyard
        - Deck
        - Fully Fenced
        - Outdoor Entertainment
        - Pool (Above Ground)
        - Pool (Inground)
        - Remote Garage
        - Secure Parking
        - Shed
        - Tennis Court
        - Air Conditioning
        - Ducted Cooling
        - Ducted Heating
        - Evaporative Cooling
        - Heating Gas
        - Heating Electric
        - Heating Hydronic
        - Reverse Cycle Air Con
        - Split System (Heating)
        - Split System (Air Con)
        - Solar Panels
        - Water Tank
        `
        const promptTemplate = new PromptTemplate({
            template: template,
            inputVariables: ["description", "tagsList"]
        })
        const message = await promptTemplate.format({
            description: description,
            tagsList: tagsList
        })
        const chatModelResult = await chatModel.predict(message)

        setTags((oldTags) => [...oldTags, ...eval(chatModelResult)])
    }
    return (
        <div className="py-14 flex flex-col items-center justify-center">
            <div className="w-3/4">
                <h1 className='text-3xl font-extrabold'>Description to Tags</h1>
            </div>
            <div className='w-4/5 max-md:flex-col max-md:justify-center max-md:items-center flex items-start justify-between p-10'>
                <div className='w-4/6 flex flex-col justify-center items-center'>
                    <form onSubmit={getAnswer} className="w-full">
                        <textarea ref={textRef} required name="description" className="textarea textarea-primary w-full h-80" placeholder="Paste your description here"></textarea>
                        <button type="submit" className="btn btn-primary w-full mt-6">Extract</button>
                    </form>
                    <div>
                        <h2 className="mt-10 mb-2 font-bold">Total possible tags:</h2>
                        <div className="flex flex-wrap">
                            {
                                possibleTagsList.map((pTag, index) => <p className={`mt-2 px-2 py-1 ${index != 0 && "ml-2"} bg-[#2b343e] rounded-md text-white`} key={index}>{pTag}</p>)
                            }
                        </div>
                    </div>
                </div>

                <div className='flex ml-10 w-2/6 flex-col items-start justify-center'>
                    <h1 className='text-2xl font-bold'>Extracted Tags:</h1>
                    <h1 className="text-md mt-2">{tags.length == 0 && <p>No Tags found!</p>}</h1>
                    {
                        tags.map((tag, index) => <p className={`mt-2 px-2 py-1 ${index != 0 && "ml-1"} bg-pink-700 rounded-md text-white`} key={index}>{tag}</p>)
                    }
                </div>
            </div>
        </div>
    )
}

export default DescriptionToTags