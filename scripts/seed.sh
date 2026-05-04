#!/bin/bash

PROJECT_ID="iefousm2"
DATASET="production"
TOKEN="skEqST22RsEH6YMJIwJ8cpZZNWcg4FeeVTkqlFj2OCkwZuv576LAh6AbBZusb9QFjH6ud321oI7WtLII0FULudE8ziU58mLuhIsSBuloIHOZJs38KfKGKP8bfYKu85MDN5VcvzTrDC4jjkOCUi5M9wOko26DS49bXETlL6rvxmmeWF5L404B"
API_VERSION="2023-05-03"

BASE_URL="https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}"
MUTATE_URL="${BASE_URL}/data/mutate/${DATASET}"
UPLOAD_URL="${BASE_URL}/assets/images/${DATASET}"

echo "Starting seed with curl..."

# 1. Seed FAQ
echo "Seeding FAQ..."
curl -X POST "${MUTATE_URL}" \
-H "Authorization: Bearer ${TOKEN}" \
-H "Content-Type: application/json" \
-d '{
  "mutations": [
    {"create": {"_type": "faqItem", "category": "Enrollment", "question": "How do I enroll my child?", "answer": "You can enroll your child by filling out our online registration form, visiting our facility for a tour, or contacting our admissions team. The process involves submitting required documents and a brief interview."}},
    {"create": {"_type": "faqItem", "category": "Enrollment", "question": "What age groups do you accept?", "answer": "We accept children from 3 months to 8 years old, with specialized programs for infants, toddlers, preschoolers, and after-school care."}},
    {"create": {"_type": "faqItem", "category": "Enrollment", "question": "Is there a waiting list?", "answer": "Some of our programs have waiting lists due to high demand. We recommend applying early and our team will notify you as soon as a spot becomes available."}},
    {"create": {"_type": "faqItem", "category": "Enrollment", "question": "What documents are required for enrollment?", "answer": "Required documents include birth certificate, immunization records, medical report, two passport photos, and completed enrollment forms."}},
    {"create": {"_type": "faqItem", "category": "Payments", "question": "What are the tuition fees?", "answer": "Tuition fees vary by program. Infant care starts at \u20a680,000/month, toddler at \u20a670,000/month, preschool at \u20a660,000/month, and after-school at \u20a640,000/month. Contact us for detailed fee structures."}},
    {"create": {"_type": "faqItem", "category": "Payments", "question": "What payment methods do you accept?", "answer": "We accept bank transfers, card payments (via Stripe), PayPal, and cash payments at our administrative office."}},
    {"create": {"_type": "faqItem", "category": "Payments", "question": "Is there a registration fee?", "answer": "Yes, there is a one-time registration fee of \u20a620,000 which covers administrative processing and welcome materials."}},
    {"create": {"_type": "faqItem", "category": "Payments", "question": "Do you offer sibling discounts?", "answer": "Yes! We offer a 10% discount on tuition for the second child and 15% for the third child onwards from the same family."}},
    {"create": {"_type": "faqItem", "category": "Schedule", "question": "What are your operating hours?", "answer": "We are open Monday to Friday from 7:00 AM to 6:00 PM. We also offer extended care until 7:00 PM for an additional fee."}},
    {"create": {"_type": "faqItem", "category": "Schedule", "question": "Do you provide meals?", "answer": "Yes, we provide nutritious breakfast, lunch, and two snacks daily. Our menu is developed by a child nutritionist and accommodates allergies and dietary restrictions."}},
    {"create": {"_type": "faqItem", "category": "Schedule", "question": "What is your pick-up policy?", "answer": "Children must be picked up by 6:00 PM. Late pick-ups after 6:15 PM incur a fee of \u20a61,000 per 15 minutes."}},
    {"create": {"_type": "faqItem", "category": "Schedule", "question": "Are you open during holidays?", "answer": "We are closed on major public holidays. We offer holiday camps during long breaks for interested families."}},
    {"create": {"_type": "faqItem", "category": "Health & Safety", "question": "What COVID-19 safety measures do you have?", "answer": "We follow all NCDC guidelines including regular sanitization, temperature checks, handwashing protocols, and limited class sizes."}},
    {"create": {"_type": "faqItem", "category": "Health & Safety", "question": "What happens if my child gets sick?", "answer": "We have a dedicated sick bay and trained staff. Parents are contacted immediately, and we have partnerships with nearby pediatric clinics."}},
    {"create": {"_type": "faqItem", "category": "Health & Safety", "question": "Are your staff trained in first aid?", "answer": "All staff members are certified in pediatric first aid and CPR. We conduct regular refresher training sessions."}},
    {"create": {"_type": "faqItem", "category": "Health & Safety", "question": "How do you handle allergies?", "answer": "All allergies are documented and shared with kitchen and teaching staff. We maintain an allergy-free environment and carry epinephrine for severe cases."}},
    {"create": {"_type": "faqItem", "category": "Programs", "question": "What curriculum do you follow?", "answer": "We blend the Nigerian Early Childhood Development Framework with Montessori and Reggio Emilia approaches, focusing on play-based learning."}},
    {"create": {"_type": "faqItem", "category": "Programs", "question": "Do you have outdoor activities?", "answer": "Yes! We have a large playground and daily outdoor play time. We also organize field trips and nature walks regularly."}},
    {"create": {"_type": "faqItem", "category": "Programs", "question": "What languages are taught?", "answer": "English is our primary language of instruction. We also introduce basic Yoruba, Igbo, and Hausa through songs and cultural activities."}},
    {"create": {"_type": "faqItem", "category": "Programs", "question": "Do you prepare children for primary school?", "answer": "Absolutely. Our preschool program focuses on school readiness including literacy, numeracy, social skills, and independence."}}
  ]
}'
echo -e "\nFAQ seeded."

# Function to upload image and return asset ID
upload_image() {
  local img_path=$1
  local full_path="public/${img_path}"
  if [ ! -f "${full_path}" ]; then
    echo "Image not found: ${full_path}" >&2
    return 1
  fi
  local res=$(curl -s -X POST "${UPLOAD_URL}?filename=$(basename ${img_path})" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: image/jpeg" \
    --data-binary "@${full_path}")
  echo $(echo $res | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
}

# 2. Seed Programs
echo "Seeding Programs..."
PROGRAMS=("infant" "toddler" "preschool" "afterschool")
PROGRAM_NAMES=("Infant Care" "Toddler Program" "Preschool" "After School")
PROGRAM_AGES=("3 - 12 months" "1 - 3 years" "3 - 5 years" "5 - 8 years")
PROGRAM_IMAGES=("images/program-infant.jpg" "images/program-toddler.jpg" "images/program-preschool.jpg" "images/program-afterschool.jpg")

for i in "${!PROGRAMS[@]}"; do
  echo "Uploading image for ${PROGRAM_NAMES[$i]}..."
  ASSET_ID=$(upload_image "${PROGRAM_IMAGES[$i]}")
  if [ -n "${ASSET_ID}" ]; then
    echo "Creating program doc: ${PROGRAM_NAMES[$i]}"
    curl -s -X POST "${MUTATE_URL}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{
      \"mutations\": [{
        \"create\": {
          \"_type\": \"program\",
          \"name\": \"${PROGRAM_NAMES[$i]}\",
          \"ageRange\": \"${PROGRAM_AGES[$i]}\",
          \"isActive\": true,
          \"image\": {
            \"_type\": \"image\",
            \"asset\": { \"_type\": \"reference\", \"_ref\": \"${ASSET_ID}\" }
          }
        }
      }]
    }"
    echo -e "\n"
  fi
done

# 3. Seed Gallery
echo "Seeding Gallery..."
GALLERY_IMAGES=("images/gallery-classroom-1.jpg" "images/gallery-outdoor-1.jpg" "images/gallery-art-1.jpg" "images/gallery-classroom-2.jpg")
GALLERY_CAPTIONS=("Modern learning environment" "Safe playground area" "Creative expression time" "Quiet reading corner")
GALLERY_CATS=("Classroom" "Outdoor" "Art & Craft" "Classroom")

for i in "${!GALLERY_IMAGES[@]}"; do
  echo "Uploading image: ${GALLERY_CAPTIONS[$i]}..."
  ASSET_ID=$(upload_image "${GALLERY_IMAGES[$i]}")
  if [ -n "${ASSET_ID}" ]; then
    echo "Creating gallery doc: ${GALLERY_CAPTIONS[$i]}"
    curl -s -X POST "${MUTATE_URL}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{
      \"mutations\": [{
        \"create\": {
          \"_type\": \"galleryImage\",
          \"caption\": \"${GALLERY_CAPTIONS[$i]}\",
          \"category\": \"${GALLERY_CATS[$i]}\",
          \"image\": {
            \"_type\": \"image\",
            \"asset\": { \"_type\": \"reference\", \"_ref\": \"${ASSET_ID}\" }
          }
        }
      }]
    }"
    echo -e "\n"
  fi
done

echo "Seed complete!"
